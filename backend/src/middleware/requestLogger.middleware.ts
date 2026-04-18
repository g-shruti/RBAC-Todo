import { NextFunction, Request, Response } from "express";

import { logger } from "../logger/logger";

export const requestLogger = (request: Request, response: Response, next: NextFunction): void => {
  const startedAt = process.hrtime.bigint();

  response.on("finish", () => {
    const finishedAt = process.hrtime.bigint();
    const responseTimeMs = Number(finishedAt - startedAt) / 1_000_000;

    logger.info("HTTP request completed", {
      method: request.method,
      url: request.originalUrl,
      statusCode: response.statusCode,
      responseTimeMs: Number(responseTimeMs.toFixed(2)),
    });
  });

  next();
};
