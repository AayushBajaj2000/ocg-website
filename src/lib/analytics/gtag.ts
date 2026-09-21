export const GA_MEASUREMENT_ID = "G-570SLR7PDN";

// Analytics only runs on the real site: preview deployments, the *.vercel.app alias and localhost
// would otherwise mix test traffic into the same property.
const ANALYTICS_HOSTS = new Set(["www.opencoregroup.com", "opencoregroup.com"]);

export const isAnalyticsHost = (hostname: string) => ANALYTICS_HOSTS.has(hostname);

type GtagEvent = "generate_lead" | "book_call";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Sends a GA4 event. A no-op until the visitor has accepted cookies and gtag has loaded. */
export const trackEvent = (name: GtagEvent, params: Record<string, string | number> = {}): void => {
  window.gtag?.("event", name, params);
};
