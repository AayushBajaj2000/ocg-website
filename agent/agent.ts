import { defineAgent } from "eve";

/**
 * Which model answers on the website.
 *
 * A plain "provider/model" string routes through the Vercel AI Gateway: authenticated by
 * AI_GATEWAY_API_KEY locally and by project OIDC on Vercel deployments, so no provider key
 * lives in this repo.
 *
 * Chosen by testing the cheapest gateway models against this agent's own brief (2026-09-21):
 * of the $0.10/$0.40-per-million tier, this was the only one that stayed accurate, refused
 * off-topic requests, and never invented a price, while answering in about a second.
 * gpt-4.1-nano made up a starting price, nova-lite wrote code on request, and qwen3.5-flash
 * reasons for thousands of tokens per reply. It is also available on the gateway's free tier.
 * Re-run that comparison before changing it; override per environment with ASSISTANT_MODEL.
 */
const DEFAULT_ASSISTANT_MODEL = "google/gemini-2.5-flash-lite";

export default defineAgent({
  model: process.env.ASSISTANT_MODEL?.trim() || DEFAULT_ASSISTANT_MODEL,
});
