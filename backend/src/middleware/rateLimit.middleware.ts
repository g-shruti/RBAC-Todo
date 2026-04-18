import rateLimit from "express-rate-limit";

import { HTTP_STATUS } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";

const createRateLimiter = (windowMs: number, max: number) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_request, response) => {
      response.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
        success: false,
        message: MESSAGES.APP.TOO_MANY_REQUESTS,
        errorCode: "RATE_LIMIT_EXCEEDED",
      });
    },
  });

export const globalRateLimiter = createRateLimiter(15 * 60 * 1000, 300);
export const authRateLimiter = createRateLimiter(15 * 60 * 1000, 30);
