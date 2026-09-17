import "server-only";

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const TIMEOUT_MS = 5000;

const EXPECTED_ACTION = "contact";

// Cloudflare's JSON uses hyphenated keys; keep this loose so unknown fields never break parsing.
type SiteverifyResponse = {
  success?: boolean;
  action?: string;
  hostname?: string;
  "error-codes"?: string[];
};

type VerifyArgs = {
  token: string;
  secret: string;
  remoteIp?: string;
};

export type TurnstileResult =
  | { status: "success" }
  | { status: "rejected"; errorCodes: string[] }
  | { status: "misconfigured"; errorCodes: string[] };

// These mean our secret or request is wrong, not that the visitor failed a challenge.
const OUR_FAULT = new Set(["missing-input-secret", "invalid-input-secret", "bad-request"]);

export const verifyTurnstileToken = async ({
  token,
  secret,
  remoteIp,
}: VerifyArgs): Promise<TurnstileResult> => {
  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) return { status: "rejected", errorCodes: ["bad-response"] };

    const result = (await response.json()) as SiteverifyResponse;
    const errorCodes = result["error-codes"] ?? [];

    if (errorCodes.some((code) => OUR_FAULT.has(code))) {
      return { status: "misconfigured", errorCodes };
    }

    // A token minted for a different form of ours must not be replayable here.
    if (result.success !== true || (result.action && result.action !== EXPECTED_ACTION)) {
      return { status: "rejected", errorCodes };
    }

    return { status: "success" };
  } catch {
    return { status: "rejected", errorCodes: ["network-error"] };
  }
};
