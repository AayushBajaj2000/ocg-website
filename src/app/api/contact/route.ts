import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sendContactEmails } from "@/lib/email/sendContactEmails";
import { getServerEnv } from "@/lib/env/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { verifyTurnstileToken } from "@/lib/turnstile/verify";
import {
  contactSubmissionSchema,
  toFieldErrors,
  toIssuePaths,
  type ContactFieldErrors,
} from "@/lib/validation/contact";
import type { IContactErrorCode, IContactResponse } from "@/types";

// No `runtime` export: Node is the default and the Edge runtime is deprecated in Next 16.
// No `dynamic` export either: POST handlers are never cached.
export const maxDuration = 15;

const MAX_BODY_BYTES = 16 * 1024;

const getClientIp = (request: NextRequest): string =>
  request.headers.get("x-real-ip") ??
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
  "unknown";

const log = (level: "info" | "warn" | "error", fields: Record<string, unknown>): void => {
  const line = JSON.stringify({ scope: "contact", ...fields });

  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.info(line);
};

const ok = (requestId: string): NextResponse<IContactResponse> =>
  NextResponse.json<IContactResponse>(
    { ok: true, requestId },
    { headers: { "X-Request-Id": requestId } },
  );

const fail = (
  status: number,
  code: IContactErrorCode,
  message: string,
  requestId: string,
  fieldErrors?: ContactFieldErrors,
): NextResponse<IContactResponse> =>
  NextResponse.json<IContactResponse>(
    { ok: false, code, message, requestId, fieldErrors },
    { status, headers: { "X-Request-Id": requestId } },
  );

export const POST = async (request: NextRequest): Promise<NextResponse<IContactResponse>> => {
  const requestId = crypto.randomUUID();
  const ip = getClientIp(request);

  if (!checkRateLimit(ip)) {
    log("warn", { requestId, event: "rate_limited" });
    return fail(
      429,
      "RATE_LIMITED",
      "Too many attempts. Please try again in a few minutes.",
      requestId,
    );
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return fail(400, "INVALID_BODY", "We couldn't read that submission.", requestId);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return fail(413, "PAYLOAD_TOO_LARGE", "That message is too long.", requestId);
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return fail(400, "INVALID_BODY", "We couldn't read that submission.", requestId);
  }

  const parsed = contactSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    // Paths only: issue values are the submitted PII.
    log("warn", { requestId, event: "validation_failed", paths: toIssuePaths(parsed.error) });
    return fail(
      422,
      "VALIDATION_FAILED",
      "Please check the highlighted fields.",
      requestId,
      toFieldErrors(parsed.error),
    );
  }

  const { turnstileToken, website, ...values } = parsed.data;

  // Honeypot hit: answer as if it worked so the bot learns nothing.
  if (website) {
    log("info", { requestId, event: "honeypot" });
    return ok(requestId);
  }

  try {
    const env = getServerEnv();

    const verification = await verifyTurnstileToken({
      token: turnstileToken,
      secret: env.TURNSTILE_SECRET_KEY,
      remoteIp: ip === "unknown" ? undefined : ip,
    });

    if (verification.status === "misconfigured") {
      log("error", { requestId, event: "turnstile_misconfigured", codes: verification.errorCodes });
      return fail(
        500,
        "SERVER_ERROR",
        "Something went wrong on our end. Please try again later.",
        requestId,
      );
    }

    if (verification.status === "rejected") {
      log("warn", { requestId, event: "turnstile_rejected", codes: verification.errorCodes });
      return fail(
        403,
        "TURNSTILE_FAILED",
        "We couldn't verify that you're human. Please try again.",
        requestId,
      );
    }

    const sent = await sendContactEmails(values);

    if (!sent.ok) {
      log("error", { requestId, event: "send_failed", reason: sent.reason });
      return fail(
        502,
        "EMAIL_SEND_FAILED",
        "We couldn't send your message. Please try again, or email us directly.",
        requestId,
      );
    }

    log("info", { requestId, event: "sent" });
    return ok(requestId);
  } catch (error) {
    log("error", {
      requestId,
      event: "unhandled",
      error: error instanceof Error ? error.message : "unknown",
    });
    return fail(
      500,
      "SERVER_ERROR",
      "Something went wrong on our end. Please try again later.",
      requestId,
    );
  }
};
