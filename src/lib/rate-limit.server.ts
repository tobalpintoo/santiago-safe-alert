// Server-only. The .server.ts suffix keeps this out of the client bundle.
//
// In-memory, per-instance rate limiting. This is intentionally simple:
// it's enough to stop a single abusive client from hammering the form
// (each request still re-validates with zod regardless). It is NOT a
// substitute for a shared store — on serverless platforms each instance
// has its own memory, so a determined attacker rotating across instances
// won't be fully blocked. If abuse becomes a real problem, swap this for
// a shared store (e.g. Upstash Redis) using the same interface below.

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Periodically drop stale buckets so this Map doesn't grow forever on a
// long-lived server instance.
const SWEEP_INTERVAL_MS = 5 * 60 * 1000;
let lastSweep = Date.now();

function sweep(now: number) {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

/**
 * Returns true if the request for `key` is allowed, false if it should be
 * rejected for exceeding `limit` requests within `windowMs`.
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  sweep(now);

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= limit) return false;

  bucket.count += 1;
  return true;
}
