#!/usr/bin/env node
/**
 * Local Lighthouse audit against a production build.
 *
 *   pnpm lighthouse                 # build, serve, audit / and /work on mobile + desktop
 *   LH_SKIP_BUILD=1 pnpm lighthouse # reuse the existing .next-lighthouse build
 *   LH_ROUTES=/,/work pnpm lighthouse
 *   LH_RUNS=3 pnpm lighthouse       # 3 passes per target, median-performance run reported
 *
 * Builds with source maps (see next.config.ts) so every issue can be traced to source files.
 * Always exits 0 on low scores — this reports, it does not gate.
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import { createSourceLocator } from "./lighthouse/attribution.mjs";
import {
  CATEGORIES,
  SHORT_NAMES,
  TARGETS,
  c,
  paint,
  renderTarget,
  stripAnsi,
} from "./lighthouse/report.mjs";

const PORT = Number(process.env.LH_PORT ?? 4310);
const ORIGIN = `http://127.0.0.1:${PORT}`;
const OUT_DIR = path.resolve(process.cwd(), ".lighthouse");
const NEXT_BIN = path.resolve(process.cwd(), "node_modules/.bin/next");
// next.config.ts switches to a source-mapped build in `.next-lighthouse` when this is set.
const LIGHTHOUSE_ENV = { ...process.env, LIGHTHOUSE: "1" };
const BUILD_DIR = path.resolve(process.cwd(), ".next-lighthouse");
const RUNS = Math.max(1, Number(process.env.LH_RUNS ?? 1));
const ROUTES = (process.env.LH_ROUTES ?? "/,/work")
  .split(",")
  .map((route) => route.trim())
  .filter(Boolean);

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
    await run(NEXT_BIN, ["build"], { env: LIGHTHOUSE_ENV });
  } else if (!existsSync(path.join(BUILD_DIR, "BUILD_ID"))) {
    throw new Error("No .next-lighthouse build to reuse — run `pnpm lighthouse` once first.");
  }

  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  console.log(`\n${c.bold}› next start on ${ORIGIN}${c.reset}`);
  let shuttingDown = false;
  let chrome;
  const server = spawn(NEXT_BIN, ["start", "--port", String(PORT), "--hostname", "127.0.0.1"], {
    stdio: ["ignore", "ignore", "inherit"],
    env: { ...LIGHTHOUSE_ENV, PORT: String(PORT) },
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

  const locate = createSourceLocator(process.cwd());
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

        const { lines, scores } = renderTarget(chosen.lhr, {
          label: `${route}  ${c.dim}(${formFactor})${c.reset}`,
          origin: ORIGIN,
          locate,
          buildDir: BUILD_DIR,
        });
        console.log(lines.join("\n"));
        await writeFile(
          path.join(OUT_DIR, `${slug}.issues.txt`),
          `${stripAnsi(lines.join("\n")).trim()}\n`,
        );
        summary.push({
          route,
          formFactor,
          scores,
          report: `.lighthouse/${slug}.html`,
          issues: `.lighthouse/${slug}.issues.txt`,
        });
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
  console.log(
    `\n${c.dim}Full reports in ${OUT_DIR} — *.issues.txt has the text above per target${c.reset}`,
  );
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
