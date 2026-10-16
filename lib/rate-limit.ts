
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

type RateLimitAction =
  | "photo-upload"
  | "enquiry-submit"
  | "session-create";

const limiters: Partial<Record<RateLimitAction, Ratelimit>> = {};

function getLimiter(action: RateLimitAction): Ratelimit {
  if (limiters[action]) {
    return limiters[action];
  }

  const redis = Redis.fromEnv();

  const limiter = new Ratelimit({
    redis,
    limiter:
      action === "photo-upload"
        ? Ratelimit.slidingWindow(12, "10 m")
        : Ratelimit.slidingWindow(5, "1 h"),
    analytics: false,
    prefix: `northstar:${action}`,
  });

  limiters[action] = limiter;
  return limiter;
}

export async function enforceRateLimit(
  request: Request,
  action: RateLimitAction,
): Promise<NextResponse | null> {
    // Keep local development testing unrestricted.
  // Rate limiting remains active in production.
  if (process.env.NODE_ENV !== "production") {
    return null;
  }
  const ipHeader =
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip");

  const ip = ipHeader?.split(",")[0]?.trim() || "unknown";

  try {
    const result = await getLimiter(action).limit(`ip:${ip}`);

    if (result.success) {
      return null;
    }

    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((result.reset - Date.now()) / 1000),
    );

    return NextResponse.json(
      {
        error:
          action === "photo-upload"
            ? "Too many photo uploads. Please wait before uploading again."
            : "Too many quote submissions. Please wait before trying again.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSeconds),
          "X-RateLimit-Limit": String(result.limit),
          "X-RateLimit-Remaining": String(
            Math.max(0, result.remaining),
          ),
        },
      },
    );
  } catch (error) {
    console.error("Rate limit service failed:", error);

    // Fail closed if Redis is unavailable.
    return NextResponse.json(
      {
        error:
          "This service is temporarily unavailable. Please try again shortly.",
      },
      { status: 503 },
    );
  }
}
