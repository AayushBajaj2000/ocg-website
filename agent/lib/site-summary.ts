// The agent runs as its own service, outside Next, so it can't import the site's `server-only`
// modules. It reads the same summary the site already publishes at /llms.txt instead: one source
// of truth, and nothing the assistant knows that the public pages don't say.

const PRODUCTION_SITE_URL = "https://www.opencoregroup.com";
const TTL_MS = 60 * 60 * 1000; // matches /llms.txt's own hourly revalidation
const TIMEOUT_MS = 5000;

let cached: { text: string; at: number } | null = null;

const summaryUrl = (): string => {
  if (process.env.ASSISTANT_KNOWLEDGE_URL) return process.env.ASSISTANT_KNOWLEDGE_URL;
  const site = (process.env.SITE_URL || PRODUCTION_SITE_URL).replace(/\/+$/, "");
  return `${site}/llms.txt`;
};

// /llms.txt links pages by absolute URL, which is right for outside crawlers. The chat panel
// navigates in-app, so hand the model site-relative paths, both inside Markdown links and where a
// URL stands on its own ("Start a project: https://…/contact").
const toSitePaths = (summary: string): string =>
  summary.replace(
    /https?:\/\/(?:www\.)?opencoregroup\.com(\/[^)\s]*)?/g,
    (_match, path: string | undefined) => path || "/",
  );

/** `null` when the summary can't be fetched; the caller decides what the model is told then. */
export const loadSiteSummary = async (): Promise<string | null> => {
  if (cached && Date.now() - cached.at < TTL_MS) return cached.text;

  try {
    const response = await fetch(summaryUrl(), { signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = toSitePaths((await response.text()).trim());
    if (!text) throw new Error("empty summary");
    cached = { text, at: Date.now() };
    return text;
  } catch (error) {
    console.warn("[assistant] site summary unavailable", String(error));
    // A stale summary beats none: site copy changes slowly.
    return cached?.text ?? null;
  }
};
