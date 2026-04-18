import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";

export const validate =
  (schema: ZodTypeAny) =>
  (request: Request, _response: Response, next: NextFunction): void => {
    const parsed = schema.parse({
      body: request.body ?? {},
      params: { ...(request.params ?? {}) },
      query: { ...(request.query ?? {}) },
    }) as {
      body: Request["body"];
      params: Request["params"];
      query: Request["query"];
    };

    request.body = parsed.body;
    request.params = parsed.params;
    Object.keys(request.query).forEach((key) => {
      delete request.query[key];
    });
    Object.assign(request.query, parsed.query);

    next();
  };
