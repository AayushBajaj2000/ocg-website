#!/usr/bin/env node
/**
 * Local Lighthouse audit against a production build.
 *
 *   pnpm lighthouse                 # build, serve, audit / and /work on mobile + desktop
 *   LH_SKIP_BUILD=1 pnpm lighthouse # reuse the existing .next build
 *   LH_ROUTES=/,/work pnpm lighthouse
 *   LH_RUNS=3 pnpm lighthouse       # 3 passes per target, median-performance run reported
 *
 * Always exits 0 on low scores — this reports, it does not gate.
 */
import { spawn } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

const PORT = Number(process.env.LH_PORT ?? 4310);
const ORIGIN = `http://127.0.0.1:${PORT}`;
const OUT_DIR = path.resolve(process.cwd(), ".lighthouse");
const NEXT_BIN = path.resolve(process.cwd(), "node_modules/.bin/next");
const RUNS = Math.max(1, Number(process.env.LH_RUNS ?? 1));
const ROUTES = (process.env.LH_ROUTES ?? "/,/work")
  .split(",")
  .map((route) => route.trim())
  .filter(Boolean);

const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];

// Short column headings for the summary table.
const SHORT_NAMES = {
  performance: "perf",
  accessibility: "a11y",
  "best-practices": "bestPr",
  seo: "seo",
};

// Advisory only — printed as a pass/fail mark, never reflected in the exit code.
const TARGETS = {
  performance: 90,
  accessibility: 100,
  "best-practices": 95,
  seo: 100,
};

// Lighthouse's own mobile/desktop presets, inlined so we don't import internal paths.
const FORM_FACTORS = {
  mobile: {
    formFactor: "mobile",
    screenEmulation: {
      mobile: true,
      width: 412,
      height: 823,
      deviceScaleFactor: 1.75,
      disabled: false,
    },
    throttling: { rttMs: 150, throughputKbps: 1638.4, cpuSlowdownMultiplier: 4 },
  },
  desktop: {
    formFactor: "desktop",
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
    throttling: { rttMs: 40, throughputKbps: 10 * 1024, cpuSlowdownMultiplier: 1 },
    emulatedUserAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Chrome-Lighthouse",
  },
};

const KEY_METRICS = [
  "first-contentful-paint",
  "largest-contentful-paint",
  "total-blocking-time",
  "cumulative-layout-shift",
  "speed-index",
];

// These display modes carry no pass/fail signal.
const IGNORED_MODES = new Set(["notApplicable", "manual", "informative"]);

const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
};
const paint = (score) => (score >= 90 ? c.green : score >= 50 ? c.yellow : c.red);

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit", ...opts });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`${path.basename(cmd)} ${args.join(" ")} exited with ${code}`)),
    );
  });
}

async function waitForServer(url, timeoutMs = 90_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { redirect: "manual" });
      if (res.status < 500) return;
    } catch {
      // not listening yet
    }
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error(`Server never became ready at ${url}`);
}

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

/** A few concrete offenders — DOM nodes for a11y, URLs for perf. */
function evidence(audit) {
  return (audit.details?.items ?? [])
    .slice(0, 3)
    .map((item) => {
      const text =
        item.node?.snippet ??
        item.node?.selector ??
        item.url ??
        item.source?.url ??
        item.sourceLocation?.url ??
        item.label ??
        null;
      if (!text) return null;
      const saving =
        item.wastedBytes != null
          ? ` (${Math.round(item.wastedBytes / 1024)} KiB)`
          : item.wastedMs != null
            ? ` (${Math.round(item.wastedMs)} ms)`
            : "";
      return `${String(text).replace(/\s+/g, " ").slice(0, 140)}${saving}`;
    })
    .filter(Boolean);
}

function reportTarget(lhr, label) {
  console.log(`\n${c.bold}━━ ${label}${c.reset}`);

  const scores = {};
  for (const id of CATEGORIES) {
    const score = Math.round((lhr.categories[id].score ?? 0) * 100);
    scores[id] = score;
    const mark = score >= TARGETS[id] ? `${c.green}✓${c.reset}` : `${c.red}✗${c.reset}`;
    console.log(
      `  ${mark} ${lhr.categories[id].title.padEnd(16)}` +
        `${paint(score)}${c.bold}${String(score).padStart(3)}${c.reset}` +
        ` ${c.dim}(target ${TARGETS[id]})${c.reset}`,
    );
  }

  const metrics = KEY_METRICS.map(
    (id) => `${lhr.audits[id]?.title}: ${lhr.audits[id]?.displayValue ?? "n/a"}`,
  );
  console.log(`  ${c.dim}${metrics.join("  ·  ")}${c.reset}`);

  for (const id of CATEGORIES) {
    const failures = failingAudits(lhr, id);
    if (!failures.length) continue;
    console.log(`\n  ${c.cyan}${lhr.categories[id].title} — ${failures.length} issue(s)${c.reset}`);
    for (const audit of failures) {
      const value = audit.displayValue ? ` ${c.dim}— ${audit.displayValue}${c.reset}` : "";
      const savings = audit.details?.overallSavingsMs
        ? ` ${c.dim}[~${Math.round(audit.details.overallSavingsMs)} ms]${c.reset}`
        : "";
      const weight = audit.weight ? `${c.dim}(w${audit.weight})${c.reset} ` : "";
      console.log(`    ${c.red}•${c.reset} ${weight}${audit.title}${value}${savings}`);
      for (const line of evidence(audit)) console.log(`        ${c.dim}↳ ${line}${c.reset}`);
    }
  }

  return scores;
}

async function auditOnce(url, formFactor, chromePort) {
  const result = await lighthouse(
    url,
    { port: chromePort, output: ["html", "json"], logLevel: "error" },
    {
      extends: "lighthouse:default",
      settings: {
        onlyCategories: CATEGORIES,
        throttlingMethod: "simulate",
        ...FORM_FACTORS[formFactor],
      },
    },
  );
  if (!result) throw new Error(`Lighthouse returned no result for ${url}`);
  return result;
}

/** Lighthouse recommends reporting the median run when sampling more than once. */
function medianRun(results) {
  const sorted = [...results].sort(
    (a, b) => a.lhr.categories.performance.score - b.lhr.categories.performance.score,
  );
  return sorted[Math.floor(sorted.length / 2)];
}

function slugFor(route, formFactor) {
  const base = route === "/" ? "home" : route.replace(/^\/|\/$/g, "").replace(/\//g, "-");
  return `${base}.${formFactor}`;
}

async function main() {
  if (process.env.LH_SKIP_BUILD !== "1") {
    console.log(`${c.bold}› next build${c.reset}`);
    await run(NEXT_BIN, ["build"]);
  }

  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  console.log(`\n${c.bold}› next start on ${ORIGIN}${c.reset}`);
  let shuttingDown = false;
  let chrome;
  const server = spawn(NEXT_BIN, ["start", "--port", String(PORT), "--hostname", "127.0.0.1"], {
    stdio: ["ignore", "ignore", "inherit"],
    env: { ...process.env, PORT: String(PORT) },
  });
  server.on("exit", (code) => {
    if (code && !shuttingDown) console.error(`next start exited with ${code}`);
  });

  const shutdown = () => {
    shuttingDown = true;
    chrome?.kill();
    if (!server.killed) server.kill("SIGTERM");
  };
  process.on("SIGINT", () => {
    shutdown();
    process.exit(130);
  });

  const summary = [];
  try {
    await waitForServer(ORIGIN);
    chrome = await chromeLauncher.launch({
      chromeFlags: ["--headless=new", "--disable-gpu", "--no-first-run", "--disable-extensions"],
    });

    for (const route of ROUTES) {
      for (const formFactor of Object.keys(FORM_FACTORS)) {
        const url = `${ORIGIN}${route}`;
        const runs = [];
        for (let i = 0; i < RUNS; i++) runs.push(await auditOnce(url, formFactor, chrome.port));
        const chosen = medianRun(runs);

        const slug = slugFor(route, formFactor);
        const [html, json] = chosen.report;
        await writeFile(path.join(OUT_DIR, `${slug}.html`), html);
        await writeFile(path.join(OUT_DIR, `${slug}.json`), json);

        const scores = reportTarget(chosen.lhr, `${route}  ${c.dim}(${formFactor})${c.reset}`);
        summary.push({ route, formFactor, scores, report: `.lighthouse/${slug}.html` });
      }
    }
  } finally {
    shutdown();
  }

  await writeFile(
    path.join(OUT_DIR, "summary.json"),
    JSON.stringify(
      { generatedAt: new Date().toISOString(), targets: TARGETS, results: summary },
      null,
      2,
    ),
  );

  console.log(`\n${c.bold}Summary${c.reset}`);
  console.log(
    `  ${"route".padEnd(14)}${"device".padEnd(9)}` +
      CATEGORIES.map((id) => SHORT_NAMES[id].padStart(8)).join(""),
  );
  for (const row of summary) {
    const cells = CATEGORIES.map(
      (id) => `${paint(row.scores[id])}${String(row.scores[id]).padStart(8)}${c.reset}`,
    ).join("");
    console.log(`  ${row.route.padEnd(14)}${row.formFactor.padEnd(9)}${cells}`);
  }
  console.log(`\n${c.dim}Full reports in ${OUT_DIR}${c.reset}`);
  console.log(
    `${c.dim}Note: localhost has no real network latency or CDN — treat performance as a ` +
      `relative signal, not a production number.${c.reset}`,
  );
}

main().catch((err) => {
  // Only infrastructure failures fail; low scores never do.
  console.error(`\n${c.red}Lighthouse run failed:${c.reset} ${err.message}`);
  process.exit(1);
});
