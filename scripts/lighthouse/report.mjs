/**
 * Renders one Lighthouse result as terminal lines with full context per issue:
 * why it matters, every offending item, the diagnostics behind each metric, and the
 * source files (via source maps) or JSX lines (via DOM matching) responsible.
 */
import {
  buildChunkIndex,
  groupModules,
  hasSourceMaps,
  normalizeSourcePath,
} from "./attribution.mjs";

export const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];

// Advisory only — printed as a pass/fail mark, never reflected in the exit code.
export const TARGETS = {
  performance: 90,
  accessibility: 100,
  "best-practices": 95,
  seo: 100,
};

// Short column headings for the summary table.
export const SHORT_NAMES = {
  performance: "perf",
  accessibility: "a11y",
  "best-practices": "bestPr",
  seo: "seo",
};

export const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};
export const paint = (score) => (score >= 90 ? c.green : score >= 50 ? c.yellow : c.red);
const ANSI_ESCAPE = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, "g");
export const stripAnsi = (text) => text.replace(ANSI_ESCAPE, "");

const KEY_METRICS = [
  "first-contentful-paint",
  "largest-contentful-paint",
  "total-blocking-time",
  "cumulative-layout-shift",
  "speed-index",
];

// Metric audits carry no items of their own; these are the diagnostics that explain them.
const METRIC_DRIVERS = {
  "first-contentful-paint": [
    "render-blocking-insight",
    "network-dependency-tree-insight",
    "font-display-insight",
    "server-response-time",
  ],
  "largest-contentful-paint": [
    "lcp-breakdown-insight",
    "lcp-discovery-insight",
    "image-delivery-insight",
    "render-blocking-insight",
    "network-dependency-tree-insight",
  ],
  "total-blocking-time": [
    "long-tasks",
    "bootup-time",
    "mainthread-work-breakdown",
    "unused-javascript",
    "legacy-javascript-insight",
    "duplicated-javascript-insight",
    "forced-reflow-insight",
    "third-parties-insight",
  ],
  "cumulative-layout-shift": [
    "cls-culprits-insight",
    "layout-shifts",
    "unsized-images",
    "non-composited-animations",
    "font-display-insight",
  ],
  "speed-index": [
    "render-blocking-insight",
    "bootup-time",
    "mainthread-work-breakdown",
    "non-composited-animations",
  ],
};
METRIC_DRIVERS.interactive = METRIC_DRIVERS["total-blocking-time"];
METRIC_DRIVERS["max-potential-fid"] = METRIC_DRIVERS["total-blocking-time"];

// These display modes carry no pass/fail signal.
const IGNORED_MODES = new Set(["notApplicable", "manual", "informative"]);
const MAX_ITEMS = 10;
const MAX_SUB_ITEMS = 8;
const MAX_CHUNK_MODULES = 6;
const MIN_REPORTED_UNUSED_BYTES = 256;

const clip = (text, max) => {
  const flat = String(text).replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max - 1)}…` : flat;
};
const kib = (bytes) => `${(bytes / 1024).toFixed(bytes < 10 * 1024 ? 1 : 0)} KiB`;
const ms = (value) => `${Math.round(value).toLocaleString("en-US")} ms`;
const plainDescription = (text = "") =>
  text.replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, "$1").trim();
const docsUrl = (text = "") => text.match(/\((https?:\/\/[^)]+)\)/)?.[1];

/** Every audit in a category that did not fully pass, heaviest-weighted first. */
function failingAudits(lhr, categoryId) {
  return lhr.categories[categoryId].auditRefs
    .map((ref) => {
      const audit = lhr.audits[ref.id];
      return audit && { ...audit, weight: ref.weight };
    })
    .filter(
      (audit) =>
        audit &&
        audit.score !== null &&
        audit.score < 1 &&
        !IGNORED_MODES.has(audit.scoreDisplayMode),
    )
    .sort((a, b) => b.weight - a.weight || a.score - b.score);
}

function hasDetails(audit) {
  const details = audit?.details;
  if (!details || audit.scoreDisplayMode === "notApplicable") return false;
  if (details.type === "list")
    return details.items?.some((item) => item.type !== "table" || item.items?.length);
  if (details.type === "checklist") return true;
  return Boolean(details.items?.length);
}

export function renderTarget(lhr, { label, origin, locate, buildDir }) {
  const lines = [];
  const out = (indent, text = "") => lines.push(`${" ".repeat(indent)}${text}`);
  const ctx = {
    lhr,
    origin,
    locate,
    out,
    chunks: buildChunkIndex(lhr, buildDir),
    printedAudits: new Set(),
    printedChunks: new Set(),
  };

  out(0, "");
  out(0, `${c.bold}━━ ${label}${c.reset}`);

  const scores = {};
  for (const id of CATEGORIES) {
    const score = Math.round((lhr.categories[id].score ?? 0) * 100);
    scores[id] = score;
    const mark = score >= TARGETS[id] ? `${c.green}✓${c.reset}` : `${c.red}✗${c.reset}`;
    out(
      2,
      `${mark} ${lhr.categories[id].title.padEnd(16)}` +
        `${paint(score)}${c.bold}${String(score).padStart(3)}${c.reset}` +
        ` ${c.dim}(target ${TARGETS[id]})${c.reset}`,
    );
  }
  out(
    2,
    c.dim +
      KEY_METRICS.map(
        (id) => `${lhr.audits[id]?.title}: ${lhr.audits[id]?.displayValue ?? "n/a"}`,
      ).join("  ·  ") +
      c.reset,
  );

  for (const id of CATEGORIES) {
    const failures = failingAudits(lhr, id);
    if (!failures.length) continue;
    out(0, "");
    out(2, `${c.cyan}${c.bold}${lhr.categories[id].title} — ${failures.length} issue(s)${c.reset}`);
    const alreadyDetailed = [];
    for (const audit of failures) {
      if (ctx.printedAudits.has(audit.id)) alreadyDetailed.push(audit.title);
      else renderAudit(ctx, audit);
    }
    if (alreadyDetailed.length) {
      out(0, "");
      out(
        4,
        `${c.red}•${c.reset} ${c.dim}also failing, detailed above:${c.reset} ${alreadyDetailed.join(", ")}`,
      );
    }
    if (id === "performance") renderSourceBreakdown(ctx);
  }

  return { lines, scores };
}

function renderAudit(ctx, audit) {
  const { out } = ctx;
  ctx.printedAudits.add(audit.id);

  const value = audit.displayValue ? ` — ${audit.displayValue}` : "";
  const savings = audit.details?.overallSavingsMs
    ? ` ${c.yellow}[saves ~${ms(audit.details.overallSavingsMs)}]${c.reset}`
    : "";
  const weight = audit.weight ? `${c.dim}(weight ${audit.weight})${c.reset} ` : "";
  out(0, "");
  out(4, `${c.red}•${c.reset} ${weight}${c.bold}${audit.title}${c.reset}${value}${savings}`);

  const description = plainDescription(audit.description);
  if (description)
    out(8, `${c.dim}why: ${clip(description.replace(/\s*Learn more.*$/i, ""), 320)}${c.reset}`);
  const docs = docsUrl(audit.description);
  if (docs) out(8, `${c.dim}docs: ${docs}${c.reset}`);

  renderDetails(ctx, audit.details, 8);

  const drivers = (METRIC_DRIVERS[audit.id] ?? [])
    .map((id) => ctx.lhr.audits[id])
    .filter(hasDetails);
  if (!drivers.length) return;
  const seen = drivers.filter((driver) => ctx.printedAudits.has(driver.id));
  const fresh = drivers.filter((driver) => !ctx.printedAudits.has(driver.id));

  out(8, `${c.magenta}what drives it on this page:${c.reset}`);
  for (const driver of fresh) {
    ctx.printedAudits.add(driver.id);
    out(
      10,
      `${c.magenta}◦${c.reset} ${driver.title}${driver.displayValue ? ` — ${driver.displayValue}` : ""}`,
    );
    renderDetails(ctx, driver.details, 14);
  }
  if (seen.length) {
    out(
      10,
      `${c.magenta}◦${c.reset} ${c.dim}${fresh.length ? "also " : ""}detailed above: ${seen.map((d) => d.title).join(", ")}${c.reset}`,
    );
  }
}

function renderDetails(ctx, details, indent) {
  if (!details) return;
  switch (details.type) {
    case "table":
    case "opportunity":
      renderTable(ctx, details, indent);
      break;
    case "list":
      for (const item of details.items ?? []) renderListItem(ctx, item, indent);
      break;
    case "checklist":
      renderChecklist(ctx, details, indent);
      break;
    default:
      // debugdata, filmstrip, screenshot, treemap-data: nothing actionable to print.
      break;
  }
}

function renderListItem(ctx, item, indent) {
  const { out } = ctx;
  switch (item.type) {
    case "table":
      renderTable(ctx, item, indent);
      break;
    case "node":
      renderNode(ctx, item, indent);
      break;
    case "checklist":
      renderChecklist(ctx, item, indent);
      break;
    case "list-section":
      if (item.title) out(indent, `${c.dim}${item.title}:${c.reset}`);
      if (item.value?.type === "network-tree")
        renderNetworkTree(ctx, item.value.chains, indent + 2);
      else if (item.value?.value) out(indent + 2, String(item.value.value));
      break;
    default:
      break;
  }
}

function renderChecklist(ctx, checklist, indent) {
  for (const check of Object.values(checklist.items ?? {})) {
    const mark = check.value ? `${c.green}✓${c.reset}` : `${c.red}✗${c.reset}`;
    ctx.out(indent, `${mark} ${check.label}`);
  }
}

function renderNetworkTree(ctx, chains, indent) {
  for (const chain of Object.values(chains ?? {})) {
    const longest = chain.isLongest ? ` ${c.yellow}← longest chain${c.reset}` : "";
    ctx.out(
      indent,
      `${formatUrl(ctx, chain.url)} ${c.dim}done at ${ms(chain.navStartToEndTime)}, ${kib(chain.transferSize)}${c.reset}${longest}`,
    );
    renderNetworkTree(ctx, chain.children, indent + 3);
  }
}

function renderTable(ctx, table, indent) {
  const { out } = ctx;
  const headings = (table.headings ?? []).filter((heading) => heading.key);
  const items = table.items ?? [];

  items.slice(0, MAX_ITEMS).forEach((item, position) => {
    const columns = [];
    const followUps = [];

    for (const heading of headings) {
      const raw = item[heading.key];
      if (raw == null) continue;
      const type = typeof raw === "object" && raw.type ? raw.type : heading.valueType;

      if (type === "node") followUps.push(() => renderNode(ctx, raw, indent + 3));
      else if (type === "url") {
        const url = typeof raw === "object" ? raw.value : raw;
        columns.push(formatUrl(ctx, url));
        followUps.push(() => renderChunkContents(ctx, url, indent + 3));
      } else if (type === "source-location") columns.push(formatLocation(ctx, raw));
      else {
        const text = formatScalar(raw, type);
        if (text == null) continue;
        const labelled = ["bytes", "ms", "timespanMs", "numeric"].includes(type) && heading.label;
        columns.push(labelled ? `${heading.label}: ${text}` : text);
      }
    }

    const bullet = `${c.dim}${String(position + 1).padStart(2)}.${c.reset}`;
    out(indent, columns.length ? `${bullet} ${columns.join(`${c.dim}  ·  ${c.reset}`)}` : bullet);
    for (const followUp of followUps) followUp();
    renderSubItems(ctx, item, headings, indent + 3);
  });

  if (items.length > MAX_ITEMS)
    out(indent, `${c.dim}… ${items.length - MAX_ITEMS} more in the HTML report${c.reset}`);
}

function renderSubItems(ctx, item, headings, indent) {
  const subItems = item.subItems?.items ?? [];
  if (!subItems.length) return;
  const subHeadings = headings.filter((heading) => heading.subItemsHeading?.key);

  for (const sub of subItems.slice(0, MAX_SUB_ITEMS)) {
    const parts = subHeadings.length
      ? subHeadings.map((heading) => {
          const { key, valueType } = heading.subItemsHeading;
          const value = sub[key];
          if (value == null) return null;
          const type = value?.type ?? valueType ?? heading.valueType;
          if (type === "source-location") return formatLocation(ctx, value);
          if (type === "url")
            return formatUrl(ctx, typeof value === "object" ? value.value : value);
          if (key === "source") return resolveModuleName(ctx, item.url, value);
          const text = formatScalar(value, type);
          return text === "--" ? null : text;
        })
      : Object.entries(sub)
          .filter(([, value]) => typeof value !== "object")
          .map(([key, value]) => `${key}: ${value}`);
    ctx.out(indent, `${c.dim}↳${c.reset} ${parts.filter(Boolean).join(`${c.dim}  ·  ${c.reset}`)}`);
  }
  if (subItems.length > MAX_SUB_ITEMS) {
    ctx.out(indent, `${c.dim}↳ … ${subItems.length - MAX_SUB_ITEMS} more${c.reset}`);
  }
}

function renderNode(ctx, node, indent) {
  const { out } = ctx;
  if (node.selector) out(indent, `${c.dim}element:${c.reset} ${node.selector}`);
  if (node.snippet) out(indent, `${c.dim}html:${c.reset}    ${clip(node.snippet, 200)}`);
  if (!ctx.locate) return;
  const { markup, content } = ctx.locate(node);
  if (!markup.length && !content.length) {
    out(
      indent,
      `${c.dim}source:  not matched in src/ (dynamic markup or rendered by a dependency)${c.reset}`,
    );
    return;
  }
  const hitLine = (label, hit) =>
    out(
      indent,
      `${c.cyan}${label}${c.reset} ${c.bold}${hit.file}:${hit.line}${c.reset}  ${c.dim}${clip(hit.code, 90)}${c.reset}`,
    );
  for (const hit of markup) hitLine("markup: ", hit);
  for (const hit of content) hitLine("content:", hit);
}

/** Lists the source modules inside a JS chunk, once per target. */
function renderChunkContents(ctx, url, indent) {
  const entry = ctx.chunks.get(url);
  if (!entry?.modules.length || !url.includes("/_next/static/")) return;
  if (ctx.printedChunks.has(url)) {
    ctx.out(indent, `${c.dim}↳ chunk contents listed above${c.reset}`);
    return;
  }
  ctx.printedChunks.add(url);

  const groups = groupModules(entry.modules);
  const chunkUnused =
    !entry.perModuleUnused && entry.unusedBytes >= MIN_REPORTED_UNUSED_BYTES
      ? ` ${c.yellow}(${kib(entry.unusedBytes)} unused overall — no per-file coverage for this chunk)${c.reset}`
      : "";
  ctx.out(indent, `${c.dim}↳ this chunk contains:${c.reset}${chunkUnused}`);
  for (const group of groups.slice(0, MAX_CHUNK_MODULES)) ctx.out(indent + 4, moduleRow(group));
  if (groups.length > MAX_CHUNK_MODULES) {
    ctx.out(indent + 4, `${c.dim}… ${groups.length - MAX_CHUNK_MODULES} more modules${c.reset}`);
  }
}

function moduleRow(group) {
  const unused =
    group.unusedBytes >= MIN_REPORTED_UNUSED_BYTES
      ? `  ${c.yellow}${kib(group.unusedBytes)} unused${c.reset}`
      : "";
  const name = group.kind === "app" ? `${c.cyan}${c.bold}${group.label}${c.reset}` : group.label;
  return `${kib(group.bytes).padStart(9)}  ${name}${unused}`;
}

/** Lighthouse truncates long module names with a leading "…"; recover the full path. */
function resolveModuleName(ctx, chunkUrl, value) {
  const name = typeof value === "object" ? value.value : String(value);
  const tail = name.replace(/^…/, "");
  const match = (ctx.chunks.get(chunkUrl)?.modules ?? []).find((mod) => mod.path.endsWith(tail));
  const resolved = match?.path ?? normalizeSourcePath(tail).path;
  return resolved.startsWith("src/") ? `${c.cyan}${c.bold}${resolved}${c.reset}` : resolved;
}

function formatLocation(ctx, location) {
  if (location.type === "text") return location.value;
  if (location.original?.file) {
    const { path } = normalizeSourcePath(location.original.file);
    const text = `${path}:${location.original.line + 1}:${location.original.column + 1}`;
    return path.startsWith("src/") ? `${c.cyan}${c.bold}${text}${c.reset}` : text;
  }
  return `${formatUrl(ctx, location.url)}:${location.line + 1}:${location.column + 1} ${c.dim}(minified)${c.reset}`;
}

function formatUrl(ctx, url) {
  if (url === "Unattributable") return "Unattributable (GC, style, layout — no single script)";
  if (!url?.startsWith(ctx.origin)) return url;
  const { pathname, search, searchParams } = new URL(url);
  if (pathname === "/_next/image") {
    return `${searchParams.get("url")} ${c.dim}via next/image (w=${searchParams.get("w")}, q=${searchParams.get("q")})${c.reset}`;
  }
  if (!pathname.startsWith("/_next/")) {
    return `${pathname} ${c.dim}(HTML document — inline scripts, RSC payload, style/layout)${c.reset}`;
  }
  return pathname + search;
}

function formatScalar(value, type) {
  if (value && typeof value === "object") {
    if ("value" in value)
      return formatScalar(value.value, value.type === "numeric" ? "numeric" : "text");
    return null;
  }
  switch (type) {
    case "bytes":
      return kib(value);
    case "ms":
    case "timespanMs":
      return ms(value);
    case "numeric":
      return typeof value === "number"
        ? String(Number(value.toFixed(value < 1 ? 3 : 1)))
        : String(value);
    default:
      return typeof value === "boolean" ? (value ? "yes" : "no") : String(value);
  }
}

/** Page-wide JS weight per source file — the direct "which files" answer. */
function renderSourceBreakdown(ctx) {
  const { out } = ctx;
  out(0, "");
  out(
    4,
    `${c.bold}JavaScript on this page, by source file${c.reset} ${c.dim}(from source maps)${c.reset}`,
  );

  if (!hasSourceMaps(ctx.chunks)) {
    out(
      8,
      `${c.yellow}No source maps found — rebuild without LH_SKIP_BUILD so chunks map to files.${c.reset}`,
    );
    return;
  }

  const all = [...ctx.chunks.entries()]
    .filter(([url]) => url.includes("/_next/static/"))
    .flatMap(([, entry]) => entry.modules);
  const groups = groupModules(all);

  const app = groups.filter((group) => group.kind === "app");
  out(8, `${c.cyan}your code (src/):${c.reset}`);
  if (!app.length) out(12, `${c.dim}none shipped as client JS${c.reset}`);
  for (const group of app.slice(0, 15)) out(12, moduleRow(group));
  if (app.length > 15) out(12, `${c.dim}… ${app.length - 15} more files${c.reset}`);

  out(8, `${c.cyan}dependencies:${c.reset}`);
  for (const group of groups.filter((g) => g.kind === "dependency").slice(0, 10))
    out(12, moduleRow(group));

  out(
    8,
    `${c.dim}Lighthouse measures CPU time per chunk, not per module — match a slow chunk ` +
      `above to its contents to find the files behind TBT and long tasks.${c.reset}`,
  );
}
