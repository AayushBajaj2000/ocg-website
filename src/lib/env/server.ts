import "server-only";
import { z } from "zod";

const serverEnvSchema = z.object({
  RESEND_API_KEY: z.string().startsWith("re_", "Resend API keys start with re_"),
  CONTACT_FROM_EMAIL: z.string().min(1, "CONTACT_FROM_EMAIL is missing"),
  CONTACT_NOTIFICATION_EMAIL: z.email("CONTACT_NOTIFICATION_EMAIL must be a valid email address"),
  TURNSTILE_SECRET_KEY: z.string().min(1, "TURNSTILE_SECRET_KEY is missing"),
  SITE_URL: z.url("SITE_URL must be an absolute URL"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cached: ServerEnv | null = null;

// Lazy, not module-scope: a missing secret then fails the first request as a catchable 500
// instead of breaking `next build` in CI or a preview environment.
export const getServerEnv = (): ServerEnv => {
  if (cached) return cached;

  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success)
    throw new Error(`Invalid server environment:\n${z.prettifyError(parsed.error)}`);

  cached = parsed.data;
  return cached;
};

export const getSiteUrl = (): string => getServerEnv().SITE_URL.replace(/\/+$/, "");
