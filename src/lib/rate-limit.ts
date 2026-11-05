/**
 * In-memory sliding-window rate limiter (Wave 2 safeguard 3 — abuse
 * controls). Keyed per user + action. Per-process only: acceptable for
 * the demo stage; a multi-instance deploy would move this to Redis or
 * a DB counter.
 */
const buckets = new Map<string, number[]>();

export interface RateLimitResult {
  allowed: boolean;
  /** Requests remaining in the current window. */
  remaining: number;
}

export const rateLimit = (
  key: string,
  max: number,
  windowMs: number,
  now: number = Date.now(),
): RateLimitResult => {
  const cutoff = now - windowMs;
  const hits = (buckets.get(key) ?? []).filter((t) => t > cutoff);

  if (hits.length >= max) {
    buckets.set(key, hits);
    return { allowed: false, remaining: 0 };
  }

  hits.push(now);
  buckets.set(key, hits);

  // Opportunistic cleanup so the map can't grow unbounded.
  if (buckets.size > 10_000) {
    for (const [k, times] of buckets) {
      if (times.every((t) => t <= cutoff)) buckets.delete(k);
    }
  }

  return { allowed: true, remaining: max - hits.length };
};

/** Test helper — clears all buckets. */
export const resetRateLimits = () => buckets.clear();
