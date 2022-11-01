import { logger } from "@lib/logger";
import { AsyncMiddleware, backResponse } from "@type";

import rateLimitLib from "express-rate-limit";

const rateLimiter: AsyncMiddleware = async (req, res, next) => {
  try {
    const remoteAddress =
      (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress;

    if (!remoteAddress) {
      logger.info("[Rate Limiter] Remote address is not found");
      return backResponse.forbidden(res);
    }
  } catch (error) {
    next(error);
  }
};

type RateLimitOptions = {
  windowMs?: number;
  max?: number;
  skipFailedRequests?: boolean;
};

export const rateLimiterLib = (otps?: RateLimitOptions) =>
  rateLimitLib({
    windowMs: otps?.windowMs || 10 * 60 * 1000, // 60 mins
    max: otps?.max || 2000,
    statusCode: 429,
    legacyHeaders: false,
    standardHeaders: true,
    skipFailedRequests: otps?.skipFailedRequests || false,
    keyGenerator: (req, res) =>
      (req.headers["x-forwarded-for"] as string) ||
      req.socket.remoteAddress ||
      req.ip,
  });

export default rateLimiter;
