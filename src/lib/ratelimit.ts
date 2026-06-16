// A tiny in-memory fixed-window rate limiter. Good enough for a single-process
// app to blunt brute-force / spam / DoS (e.g. the sync bcrypt in /register).
// Not shared across instances — fine here since the app runs as one process.

type Window = { count: number; resetAt: number };

const g = globalThis as unknown as { __ourchatRate?: Map<string, Window> };
if (!g.__ourchatRate) g.__ourchatRate = new Map();
const buckets = g.__ourchatRate;

// Returns true if the action is allowed, false if the caller is over the limit.
export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const w = buckets.get(key);
  if (!w || now >= w.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (w.count >= max) return false;
  w.count += 1;
  return true;
}

// Best-effort client IP from common proxy headers (Render/most hosts set these).
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") || "unknown";
}
