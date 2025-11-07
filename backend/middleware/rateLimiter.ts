import { RateLimiterMemory } from "rate-limiter-flexible";

// Configure different rate limiters for different operations
const loginLimiter = new RateLimiterMemory({
  points: 5, // 5 attempts
  duration: 15 * 60, // per 15 minutes
  blockDuration: 15 * 60, // block for 15 minutes if exceeded
});

const registerLimiter = new RateLimiterMemory({
  points: 3, // 3 registrations
  duration: 60 * 60, // per hour
  blockDuration: 60 * 60, // block for 1 hour
});

const passwordResetLimiter = new RateLimiterMemory({
  points: 3, // 3 password reset requests
  duration: 60 * 60, // per hour
  blockDuration: 60 * 60,
});

const passwordChangeLimiter = new RateLimiterMemory({
  points: 5, // 5 password changes
  duration: 60 * 60, // per hour
  blockDuration: 60 * 60,
});

interface RateLimitResult {
  allowed: boolean;
  error?: string;
  retryAfter?: number;
}

/**
 * Check rate limit for a given key
 */
async function checkRateLimit(
  limiter: RateLimiterMemory,
  key: string,
  operation: string
): Promise<RateLimitResult> {
  try {
    await limiter.consume(key);
    return { allowed: true };
  } catch (error: any) {
    if (error.msBeforeNext) {
      const minutesLeft = Math.ceil(error.msBeforeNext / 60000);
      return {
        allowed: false,
        error: `Too many ${operation} attempts. Please try again in ${minutesLeft} minute(s).`,
        retryAfter: error.msBeforeNext,
      };
    }
    // If it's not a rate limit error, allow the request
    return { allowed: true };
  }
}

export async function checkLoginRateLimit(
  identifier: string
): Promise<RateLimitResult> {
  return checkRateLimit(loginLimiter, `login_${identifier}`, "login");
}

export async function checkRegisterRateLimit(
  identifier: string
): Promise<RateLimitResult> {
  return checkRateLimit(
    registerLimiter,
    `register_${identifier}`,
    "registration"
  );
}

export async function checkPasswordResetRateLimit(
  identifier: string
): Promise<RateLimitResult> {
  return checkRateLimit(
    passwordResetLimiter,
    `reset_${identifier}`,
    "password reset"
  );
}

export async function checkPasswordChangeRateLimit(
  identifier: string
): Promise<RateLimitResult> {
  return checkRateLimit(
    passwordChangeLimiter,
    `change_${identifier}`,
    "password change"
  );
}

/**
 * Reset rate limit for a key (e.g., after successful login)
 */
export async function resetRateLimit(
  limiter: RateLimiterMemory,
  key: string
): Promise<void> {
  try {
    await limiter.delete(key);
  } catch (error) {
    console.error("Error resetting rate limit:", error);
  }
}
