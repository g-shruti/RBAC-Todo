import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import { HTTP_STATUS } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";
import { logger } from "../logger/logger";
import { AppError } from "../utils/appError";

export const errorHandler: ErrorRequestHandler = (error, request, response, _next) => {
  if (error instanceof ZodError) {
    logger.error("Validation error", {
      method: request.method,
      url: request.originalUrl,
      issues: error.issues,
    });

    return response.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.APP.VALIDATION_FAILED,
      errorCode: "VALIDATION_ERROR",
    });
  }

  if (error instanceof AppError) {
    logger.error("Handled application error", {
      method: request.method,
      url: request.originalUrl,
      statusCode: error.statusCode,
      errorCode: error.errorCode,
      message: error.message,
    });

    return response.status(error.statusCode).json({
      success: false,
      message: error.message,
      errorCode: error.errorCode,
    });
  }

  logger.error("Unhandled application error", {
    method: request.method,
    url: request.originalUrl,
    message: error instanceof Error ? error.message : "Unknown error",
    stack: error instanceof Error ? error.stack : undefined,
  });

  return response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: MESSAGES.APP.INTERNAL_SERVER_ERROR,
    errorCode: "INTERNAL_SERVER_ERROR",
  });
};
