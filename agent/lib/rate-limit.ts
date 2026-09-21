// In-memory and per-process, like the site's contact-form limiter: a real brake on a single
// long-lived host, a speed bump on serverless where instances don't share memory. The hard
// ceiling on spend is the AI Gateway budget, not this.

const WINDOW_MS = 10 * 60 * 1000;
const MAX_KEYS = 5000;

const hits = new Map<string, number[]>();

export const consumeSend = (key: string, maxPerWindow: number): boolean => {
  const now = Date.now();

  for (const [existing, times] of hits) {
    const alive = times.filter((time) => now - time < WINDOW_MS);
    if (alive.length === 0) hits.delete(existing);
    else hits.set(existing, alive);
  }

  if (hits.size > MAX_KEYS) hits.clear();

  const recent = hits.get(key) ?? [];
  recent.push(now);
  hits.set(key, recent);

  return recent.length <= maxPerWindow;
};
