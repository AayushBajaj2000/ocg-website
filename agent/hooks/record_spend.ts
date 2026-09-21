import { defineHook } from "eve/hooks";

const tokenCount = (value: unknown): number =>
  typeof value === "number" && Number.isFinite(value) && value > 0 ? value : 0;

/**
 * One greppable "[assistant-spend]" line per model call, so what the public chat costs is a log
 * query away instead of a surprise on the gateway invoice.
 */
export default defineHook({
  events: {
    "step.completed"(event, ctx) {
      try {
        const usage = event.data.usage;
        console.info(
          "[assistant-spend]",
          JSON.stringify({
            sessionId: ctx.session.id,
            turnId: event.data.turnId,
            stepIndex: event.data.stepIndex,
            inputTokens: tokenCount(usage?.inputTokens),
            cacheReadTokens: tokenCount(usage?.cacheReadTokens),
            outputTokens: tokenCount(usage?.outputTokens),
            billedCostUsd: typeof usage?.costUsd === "number" ? usage.costUsd : null,
          }),
        );
      } catch (error) {
        console.warn("[assistant-spend] failed to record step spend", error);
      }
    },
  },
});
