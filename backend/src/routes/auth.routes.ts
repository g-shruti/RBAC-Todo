import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { asyncHandler } from "../middleware/asyncHandler";
import { authMiddleware } from "../middleware/auth.middleware";
import { authRateLimiter } from "../middleware/rateLimit.middleware";
import { validate } from "../middleware/validate.middleware";
import { loginSchema, signupSchema } from "../validators/auth.validator";

const authRouter = Router();

authRouter.post("/signup", authRateLimiter, validate(signupSchema), asyncHandler(authController.signup.bind(authController)));
authRouter.post("/login", authRateLimiter, validate(loginSchema), asyncHandler(authController.login.bind(authController)));
authRouter.get("/me", authMiddleware, asyncHandler(authController.me.bind(authController)));

export { authRouter };
