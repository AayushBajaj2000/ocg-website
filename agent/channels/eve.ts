import type { AuthFn } from "eve/channels/auth";
import { ForbiddenError, localDev, none, vercelOidc } from "eve/channels/auth";
import { eveChannel } from "eve/channels/eve";
import { consumeSend } from "../lib/rate-limit";

// Per visitor IP, per ten minutes. Enough for a real conversation, not for someone treating the
// endpoint as a free model API.
const MAX_SENDS_PER_WINDOW = 20;

// Visitor messages are capped at 1,500 characters in the composer. eve send bodies are small
// JSON envelopes, so anything past this is someone probing the endpoint.
const MAX_SEND_BYTES = 16 * 1024;

/**
 * Send-shaped requests: POST /eve/v1/session (create + first message) and
 * POST /eve/v1/session/:id (follow-up). Stream reads are GETs and cancel/clear/reset live on
 * deeper subpaths, so none of those spend a visitor's budget.
 */
const isSendRequest = (request: Request): boolean =>
  request.method === "POST" && /^\/eve\/v1\/session(\/[^/]+)?$/.test(new URL(request.url).pathname);

// Everything a visitor's chat panel needs: sends, the answer stream, and cancelling a turn.
// Nothing else (notably /eve/v1/info, which describes the agent's configuration) is theirs.
const isVisitorRoute = (request: Request): boolean => {
  const pathname = new URL(request.url).pathname;
  if (isSendRequest(request)) return true;
  if (request.method === "GET") return /^\/eve\/v1\/session\/[^/]+\/stream$/.test(pathname);
  return request.method === "POST" && /^\/eve\/v1\/session\/[^/]+\/cancel$/.test(pathname);
};

const clientIp = (request: Request): string =>
  request.headers.get("x-real-ip") ??
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
  "unknown";

// Hosts this deployment answers on. Behind Vercel's routing the agent runs as its own service,
// so the Host it sees can be an internal name rather than the public one: comparing Origin with
// Host alone wrongly rejected every visitor there.
const ownHosts = (request: Request): Set<string> => {
  const hosts = [
    request.headers.get("x-forwarded-host"),
    request.headers.get("host"),
    process.env.VERCEL_URL,
    process.env.VERCEL_BRANCH_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.SITE_URL,
  ];
  return new Set(
    hosts.flatMap((value) => {
      if (!value) return [];
      try {
        return [new URL(value.includes("://") ? value : `https://${value}`).host];
      } catch {
        return [];
      }
    }),
  );
};

// Keeps other sites from spending our tokens from their visitors' browsers. It does nothing
// against scripted clients; the rate limit and the gateway budget are for those.
const isSameOrigin = (request: Request): boolean => {
  // Set by the browser itself and impossible for page script to forge, so where it exists it is
  // the whole answer, and it doesn't depend on what Host a proxy hands us.
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite) return fetchSite === "same-origin";

  // Older browsers: fall back to Origin, which they always send on a cross-site POST.
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return ownHosts(request).has(new URL(origin).host);
  } catch {
    return false;
  }
};

// Rejections are rare and each one is a visitor who got no answer, so say why in the logs.
const refuse = (request: Request, code: string, message: string): never => {
  console.warn(
    "[assistant-gate]",
    JSON.stringify({
      code,
      origin: request.headers.get("origin"),
      fetchSite: request.headers.get("sec-fetch-site"),
      host: request.headers.get("host"),
      forwardedHost: request.headers.get("x-forwarded-host"),
    }),
  );
  throw new ForbiddenError({ code, message });
};

/**
 * First in the walk, for every caller: the checks that don't depend on who is asking. It never
 * authenticates anyone (it skips by returning null); it only refuses.
 */
const sendGuard: AuthFn<Request> = (request) => {
  if (!isSendRequest(request)) return null;

  if (!isSameOrigin(request)) {
    refuse(request, "forbidden_origin", "This assistant only serves the OpenCore website.");
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_SEND_BYTES) {
    refuse(request, "message_too_long", "That message is too long. Try a shorter question.");
  }

  return null;
};

/**
 * Last in the walk. The website is public, so visitors are anonymous: `none()` admits them
 * explicitly (eve fails closed without it), but only on the chat routes and only within the
 * per-IP send budget. This lives at the channel so skipping the chat panel doesn't skip it.
 */
const visitor = (): AuthFn<Request> => {
  const anonymous = none();

  return async (request) => {
    // Skip, so the walk ends in a 401 for anything outside the chat routes.
    if (!isVisitorRoute(request)) return null;

    if (isSendRequest(request) && !consumeSend(clientIp(request), MAX_SENDS_PER_WINDOW)) {
      refuse(
        request,
        "rate_limited",
        "That's a lot of questions in a short time. Give it a few minutes, or book a call and ask us directly.",
      );
    }

    return anonymous(request);
  };
};

export default eveChannel({
  // vercelOidc/localDev sit ahead of `visitor` so deployment-internal callers and the eve dev
  // TUI aren't spent against a visitor's send budget.
  auth: [sendGuard, vercelOidc(), localDev(), visitor()],
  uploadPolicy: "disabled",
});
