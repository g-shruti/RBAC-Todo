import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { HTTP_STATUS } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";
import { userRepository } from "../repositories/user.repository";
import { AppError } from "../utils/appError";
import { asyncHandler } from "./asyncHandler";
import { AUTH_COOKIE_NAME } from "../utils/cookies";
import { verifyAuthToken } from "../utils/jwt";

export const authMiddleware = asyncHandler(
  async (request: Request, _response: Response, next: NextFunction): Promise<void> => {
    const token = request.cookies?.[AUTH_COOKIE_NAME];

    if (!token) {
      throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED, "AUTH_REQUIRED");
    }

    try {
      const payload = verifyAuthToken(token);
      const user = await userRepository.findById(payload.userId);

      if (!user) {
        throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED, "AUTH_REQUIRED");
      }

      request.user = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      next();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
        throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED, "INVALID_TOKEN");
      }

      throw error;
    }
  },
);
