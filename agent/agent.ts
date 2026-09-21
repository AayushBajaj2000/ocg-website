import { defineAgent } from "eve";

/**
 * Which model answers on the website.
 *
 * A plain "provider/model" string routes through the Vercel AI Gateway: authenticated by
 * AI_GATEWAY_API_KEY locally and by project OIDC on Vercel deployments, so no provider key
 * lives in this repo. The job is short answers from a brief that already contains them, which a
 * small fast model does well; override per environment with ASSISTANT_MODEL.
 */
const DEFAULT_ASSISTANT_MODEL = "deepseek/deepseek-v4-flash";

export default defineAgent({
  model: process.env.ASSISTANT_MODEL?.trim() || DEFAULT_ASSISTANT_MODEL,
});
