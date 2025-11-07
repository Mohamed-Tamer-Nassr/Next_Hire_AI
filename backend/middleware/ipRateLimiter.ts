import { NextRequest } from "next/server";
import { RateLimiterMemory } from "rate-limiter-flexible";

const ipLimiter = new RateLimiterMemory({
  points: 100, // 100 requests
  duration: 15 * 60, // per 15 minutes
});

export async function checkIPRateLimit(request: NextRequest): Promise<boolean> {
  // Get IP address
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";

  try {
    await ipLimiter.consume(ip);
    return true;
  } catch (error) {
    return false;
  }
}
