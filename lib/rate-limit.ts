interface RateLimitInfo {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitInfo>();

/**
 * Basic in-memory IP Rate Limiter (Serverless Safe)
 * Limits requests per window duration.
 * 
 * @param ip Client IP Address
 * @param limit Maximum allowed requests per window
 * @param windowMs Window duration in milliseconds (default: 1 hour)
 * @returns boolean true if the IP exceeds the limit, false otherwise
 */
export function isRateLimited(ip: string, limit = 3, windowMs = 60 * 60 * 1000): boolean {
  const now = Date.now();

  // Inline memory cleanup if cache size exceeds limits
  if (rateLimitMap.size > 2000) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }

  const info = rateLimitMap.get(ip);

  if (!info) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    return false;
  }

  if (now > info.resetTime) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    return false;
  }

  if (info.count >= limit) {
    return true;
  }

  info.count += 1;
  return false;
}
