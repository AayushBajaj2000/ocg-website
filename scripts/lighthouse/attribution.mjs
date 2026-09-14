/**
 * Ties Lighthouse findings back to this repo: source-mapped JS modules for chunk URLs,
 * and best-guess source lines for flagged DOM elements.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const SOURCE_EXTENSIONS = new Set([".tsx", ".ts", ".jsx", ".js", ".mjs"]);
const MARKUP_EXTENSIONS = new Set([".tsx", ".jsx"]);
const IDENTIFYING_ATTRIBUTES = ["id", "alt", "aria-label", "title", "data-testid", "placeholder"];
const BASE64_INDEX = new Map(
  [..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"].map((ch, i) => [ch, i]),
);

/** Turns a source-map path (turbopack:///[project]/...) into a repo-relative path. */
export function normalizeSourcePath(raw) {
  const cleaned = String(raw)
    .replace(/^turbopack:\/+/, "")
    .replace(/^webpack:\/\/[^/]*\//, "")
    .replace(/^\[project\]\//, "")
    .replace(/^\.\//, "");

  if (cleaned.startsWith("[turbopack]/")) {
    return { kind: "dependency", pkg: "turbopack-runtime", path: cleaned };
  }

  const modulesAt = cleaned.lastIndexOf("node_modules/");
  if (modulesAt !== -1) {
    const rest = cleaned.slice(modulesAt + "node_modules/".length);
    // Next vendors react-dom & co. under next/dist/compiled — keep them distinguishable.
    const vendored = rest.match(/^next\/dist\/compiled\/(@[^/]+\/[^/]+|[^/]+)\//);
    const [first, second] = rest.split("/");
    const pkg = vendored
      ? `next/dist/compiled/${vendored[1]}`
      : first.startsWith("@")
        ? `${first}/${second}`
        : first;
    return { kind: "dependency", pkg, path: `node_modules/${rest}` };
  }
  return { kind: cleaned.startsWith("src/") ? "app" : "other", pkg: null, path: cleaned };
}

function decodeVlqSegment(segment) {
  const values = [];
  let value = 0;
  let shift = 0;
  for (const ch of segment) {
    const digit = BASE64_INDEX.get(ch) ?? 0;
    value += (digit & 31) * 2 ** shift;
    if (digit & 32) {
      shift += 5;
      continue;
    }
    values.push(value % 2 ? -Math.floor(value / 2) : value / 2);
    value = 0;
    shift = 0;
  }
  return values;
}

/** Generated characters attributed to each original source file. */
function sizesFromSourceMap(code, map) {
  const lines = code.split("\n");
  const totals = new Map();
  let sourceIndex = 0; // delta-encoded across the whole mappings string
  let unmapped = 0;

  map.mappings.split(";").forEach((lineMappings, lineNumber) => {
    const lineLength = lines[lineNumber]?.length ?? 0;
    const starts = [];
    let column = 0; // resets on every generated line
    for (const segment of lineMappings ? lineMappings.split(",") : []) {
      const fields = decodeVlqSegment(segment);
      column += fields[0];
      if (fields.length >= 4) {
        sourceIndex += fields[1];
        starts.push([column, sourceIndex]);
      } else {
        starts.push([column, -1]);
      }
    }
    unmapped += starts.length ? starts[0][0] : lineLength;
    starts.forEach(([start, source], i) => {
      const end = i + 1 < starts.length ? starts[i + 1][0] : lineLength;
      const span = Math.max(0, end - start);
      if (source < 0) unmapped += span;
      else totals.set(source, (totals.get(source) ?? 0) + span);
    });
  });

  const modules = [...totals].map(([index, bytes]) => ({
    ...normalizeSourcePath(map.sources[index]),
    bytes,
    unusedBytes: 0,
  }));
  if (unmapped)
    modules.push({ kind: "other", pkg: null, path: "(unmapped)", bytes: unmapped, unusedBytes: 0 });
  return modules;
}

const chunkCache = new Map();

/** Reads a served chunk and its source map from the build dir, or null if unavailable. */
function modulesFromDisk(buildDir, url) {
  const { pathname } = new URL(url);
  if (!pathname.startsWith("/_next/static/")) return null;
  const file = path.join(buildDir, pathname.slice("/_next/".length));
  if (chunkCache.has(file)) return chunkCache.get(file);

  let modules = null;
  if (existsSync(file)) {
    const code = readFileSync(file, "utf8");
    const mapName = code.match(/\/\/# sourceMappingURL=(\S+)\s*$/)?.[1];
    const mapFile = mapName && path.join(path.dirname(file), mapName);
    if (mapFile && existsSync(mapFile)) {
      modules = sizesFromSourceMap(code, JSON.parse(readFileSync(mapFile, "utf8")));
    }
  }
  chunkCache.set(file, modules);
  return modules;
}

/**
 * Maps every script URL on the page to the source modules inside it. Module sizes come
 * from the build's source maps on disk (complete for every chunk); per-module unused bytes
 * come from Lighthouse's coverage treemap wherever Lighthouse attributed that chunk.
 */
export function buildChunkIndex(lhr, buildDir) {
  const scripts = lhr.audits["script-treemap-data"]?.details?.nodes ?? [];
  const index = new Map();

  for (const script of scripts) {
    const treemapModules = [];
    const walk = (node, prefix) => {
      // Tree nodes are path segments; "(unmapped)" / "(inline) …" are labels, not segments.
      const name = prefix && !node.name.startsWith("(") ? `${prefix}/${node.name}` : node.name;
      if (node.children?.length) {
        for (const child of node.children) walk(child, name);
        return;
      }
      treemapModules.push({
        ...normalizeSourcePath(name),
        bytes: node.resourceBytes ?? 0,
        unusedBytes: node.unusedBytes ?? 0,
      });
    };
    for (const child of script.children ?? []) walk(child, "");

    const diskModules = script.name.startsWith("http")
      ? modulesFromDisk(buildDir, script.name)
      : null;
    const perModuleUnused = treemapModules.some((mod) => mod.kind !== "other");
    if (diskModules && perModuleUnused) {
      const unusedByPath = new Map(treemapModules.map((mod) => [mod.path, mod.unusedBytes]));
      for (const mod of diskModules) mod.unusedBytes = unusedByPath.get(mod.path) ?? 0;
    }

    index.set(script.name, {
      modules: (diskModules ?? treemapModules).sort((a, b) => b.bytes - a.bytes),
      unusedBytes: script.unusedBytes ?? 0,
      perModuleUnused,
    });
  }
  return index;
}

/** Collapses modules into app files + one row per dependency package. */
export function groupModules(modules) {
  const groups = new Map();
  for (const mod of modules) {
    const key = mod.kind === "dependency" ? `node_modules/${mod.pkg}` : mod.path;
    const group = groups.get(key) ?? { label: key, kind: mod.kind, bytes: 0, unusedBytes: 0 };
    group.bytes += mod.bytes;
    group.unusedBytes += mod.unusedBytes;
    groups.set(key, group);
  }
  return [...groups.values()].sort((a, b) => b.bytes - a.bytes);
}

/** True when chunks resolved to real module paths, i.e. the build had source maps. */
export function hasSourceMaps(chunkIndex) {
  for (const { modules } of chunkIndex.values()) {
    if (modules.some((mod) => mod.kind === "app" || mod.kind === "dependency")) return true;
  }
  return false;
}

function listSourceFiles(dir, root, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) listSourceFiles(full, root, files);
    else if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
      files.push({
        file: path.relative(root, full),
        isMarkup: MARKUP_EXTENSIONS.has(path.extname(entry.name)),
        lines: readFileSync(full, "utf8").split("\n"),
      });
    }
  }
  return files;
}

const tokenize = (text) => new Set(text.split(/[\s"'`{}(),]+/).filter(Boolean));

function describeNode(node) {
  const snippet = node?.snippet ?? "";
  const attribute = (name) => snippet.match(new RegExp(`\\s${name}="([^"…]+)"`))?.[1];
  const exactValues = IDENTIFYING_ATTRIBUTES.map(attribute).filter((v) => v && v.length >= 3);

  const classAttr = snippet.match(/\sclass="([^"]*)/)?.[1] ?? "";
  let classTokens = classAttr.split(/\s+/).filter(Boolean);
  if (classAttr.includes("…")) classTokens = classTokens.slice(0, -1); // last token was cut
  classTokens = classTokens.filter((token) => !token.includes("…"));

  const label = node?.nodeLabel;
  const text =
    label && label.length >= 6 && !label.includes("…") && !exactValues.includes(label)
      ? label
      : null;

  const tag = snippet.match(/^<([a-z][a-z0-9-]*)/i)?.[1]?.toLowerCase();
  // next/image renders <img>; next/link renders <a>.
  const tagOpeners = tag
    ? [`<${tag}`, ...(tag === "img" ? ["<Image"] : tag === "a" ? ["<Link"] : [])]
    : [];

  return { exactValues, classTokens, text, tagOpeners };
}

/**
 * Returns `locate(node)` → `{ markup, content }` source hits for a Lighthouse DOM node.
 *  - markup:  JSX that renders the element (tag + className overlap)
 *  - content: where its identifying text/attribute value is defined (e.g. a constants file)
 * A heuristic: class lists and literals usually survive into JSX verbatim, dynamic ones don't.
 */
export function createSourceLocator(root) {
  const files = listSourceFiles(path.join(root, "src"), root);

  return function locate(node) {
    const { exactValues, classTokens, text, tagOpeners } = describeNode(node);
    const markup = [];
    const content = [];

    for (const { file, isMarkup, lines } of files) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        let contentScore = 0;
        for (const value of exactValues) if (line.includes(value)) contentScore += 5;
        if (text && line.includes(text)) contentScore += 4;
        if (contentScore)
          content.push({ file, line: i + 1, code: line.trim(), score: contentScore });

        if (!isMarkup || !classTokens.length) continue;
        const lineTokens = tokenize(line);
        const classHits = classTokens.filter((token) => lineTokens.has(token)).length;
        if (classHits < Math.min(3, classTokens.length)) continue;

        // The class list must belong to the same element: its opening tag sits just above
        // (props can push className a dozen lines down). Short class lists are too common
        // to trust unless the tag is right there.
        const lookback = classTokens.length >= 3 ? 12 : 2;
        const opening = lines.slice(Math.max(0, i - lookback), i + 1).join(" ");
        const tagHit = tagOpeners.some((opener) => opening.includes(opener));
        if (tagHit || classHits >= 6) {
          markup.push({
            file,
            line: i + 1,
            code: line.trim(),
            score: classHits * 2 + (tagHit ? 3 : 0),
          });
        }
      }
    }
    return { markup: pickBest(markup, 2), content: pickBest(content, 1) };
  };
}

function pickBest(hits, limit) {
  const best = [];
  for (const hit of hits.sort((a, b) => b.score - a.score || a.line - b.line)) {
    // Overlapping 3-line windows report the same element several times.
    if (best.some((b) => b.file === hit.file && Math.abs(b.line - hit.line) <= 2)) continue;
    best.push(hit);
    if (best.length === limit) break;
  }
  return best;
}
