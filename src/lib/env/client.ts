import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1, "NEXT_PUBLIC_TURNSTILE_SITE_KEY is missing"),
});

// Each var is read as a full literal: Next only inlines `process.env.NEXT_PUBLIC_X` written
// exactly this way — dynamic access yields undefined in the browser.
export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
});
