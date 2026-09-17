import "server-only";

const WINDOW_MS = 10 * 60 * 1000;

const MAX_ATTEMPTS = 5;

const MAX_KEYS = 5000;

const hits = new Map<string, number[]>();

// In-memory and per-process: effective on a single long-lived Node host, a speed bump only if
// this ever moves to serverless or scales horizontally. Swap for Redis at that point.
export const checkRateLimit = (key: string): boolean => {
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

  return recent.length <= MAX_ATTEMPTS;
};
