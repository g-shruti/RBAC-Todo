import jwt, { SignOptions } from "jsonwebtoken";

import { env } from "../config/env";
import { AuthTokenPayload } from "../types/auth.types";

export const signAuthToken = (payload: AuthTokenPayload): string => {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
  } as SignOptions);
};

export const verifyAuthToken = (token: string): AuthTokenPayload => {
  return jwt.verify(token, env.jwtSecret) as AuthTokenPayload;
};
