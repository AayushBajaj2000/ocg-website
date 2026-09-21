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

const PRODUCTION_SITE_URL = "https://www.opencoregroup.com";

// Read on its own, not through `getServerEnv`: page metadata needs the origin on every route, and
// a missing mail or Turnstile secret shouldn't take the whole site's build down with it.
export const getSiteUrl = (): string => {
  const parsed = z.url().safeParse(process.env.SITE_URL);
  return (parsed.success ? parsed.data : PRODUCTION_SITE_URL).replace(/\/+$/, "");
};

const sanityEnvSchema = z.object({
  SANITY_PROJECT_ID: z.string().min(1, "SANITY_PROJECT_ID is missing"),
  SANITY_DATASET: z.string().min(1).default("production"),
  SANITY_API_VERSION: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "SANITY_API_VERSION must be a YYYY-MM-DD date")
    .default("2025-02-19"),
});

export type SanityEnv = z.infer<typeof sanityEnvSchema>;

// Separate from `getServerEnv` so statically generated content pages only need the Sanity vars,
// not the contact form's email and Turnstile secrets.
export const getSanityEnv = (): SanityEnv => {
  const parsed = sanityEnvSchema.safeParse(process.env);
  if (!parsed.success)
    throw new Error(`Invalid Sanity environment:\n${z.prettifyError(parsed.error)}`);

  return parsed.data;
};
