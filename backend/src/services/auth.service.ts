import bcrypt from "bcrypt";

import { HTTP_STATUS } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";
import { UserDocument } from "../models/user.model";
import { userRepository } from "../repositories/user.repository";
import { AuthenticatedUser } from "../types/auth.types";
import { AppError } from "../utils/appError";
import { signAuthToken } from "../utils/jwt";

interface SignupInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthResult {
  token: string;
  user: AuthenticatedUser;
}

const toAuthenticatedUser = (user: UserDocument): AuthenticatedUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
});

const isDuplicateKeyError = (error: unknown): error is { code: number } =>
  typeof error === "object" && error !== null && "code" in error && error.code === 11000;

class AuthService {
  async signup(payload: SignupInput): Promise<AuthResult> {
    const existingUser = await userRepository.findByEmail(payload.email);

    if (existingUser) {
      throw new AppError(MESSAGES.AUTH.USER_EXISTS, HTTP_STATUS.CONFLICT, "USER_ALREADY_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    try {
      const user = await userRepository.create({
        ...payload,
        password: hashedPassword,
      });

      return {
        token: signAuthToken({
          userId: user.id,
          email: user.email,
        }),
        user: toAuthenticatedUser(user),
      };
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        throw new AppError(MESSAGES.AUTH.USER_EXISTS, HTTP_STATUS.CONFLICT, "USER_ALREADY_EXISTS");
      }

      throw error;
    }
  }

  async login(payload: LoginInput): Promise<AuthResult> {
    const user = await userRepository.findByEmailWithPassword(payload.email);

    if (!user) {
      throw new AppError(MESSAGES.AUTH.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED, "INVALID_CREDENTIALS");
    }

    const isPasswordValid = await bcrypt.compare(payload.password, user.password);

    if (!isPasswordValid) {
      throw new AppError(MESSAGES.AUTH.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED, "INVALID_CREDENTIALS");
    }

    return {
      token: signAuthToken({
        userId: user.id,
        email: user.email,
      }),
      user: toAuthenticatedUser(user),
    };
  }
}

export const authService = new AuthService();
