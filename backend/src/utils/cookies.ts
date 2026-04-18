import { CookieOptions, Response } from "express";

import { env } from "../config/env";

export const AUTH_COOKIE_NAME = "token";

export const getAuthCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: env.cookieSecure,
  sameSite: env.cookieSameSite,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  domain: env.cookieDomain,
});

export const setAuthCookie = (response: Response, token: string): void => {
  response.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
};
