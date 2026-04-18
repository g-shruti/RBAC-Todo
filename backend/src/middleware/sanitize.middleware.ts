import { NextFunction, Request, Response } from "express";

import { sanitizeValue } from "../utils/sanitize";

export const sanitizeRequest = (request: Request, _response: Response, next: NextFunction): void => {
  request.body = sanitizeValue(request.body);
  request.params = sanitizeValue(request.params) as Request["params"];

  const sanitizedQuery = sanitizeValue(request.query) as Record<string, unknown>;
  Object.keys(request.query).forEach((key) => {
    delete request.query[key];
  });
  Object.assign(request.query, sanitizedQuery);

  next();
};
