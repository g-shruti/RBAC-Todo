import { Request, Response } from "express";

import { HTTP_STATUS } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";
import { authService } from "../services/auth.service";
import { sendSuccess } from "../utils/apiResponse";
import { setAuthCookie } from "../utils/cookies";

interface SignupBody {
  name: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

class AuthController {
  async signup(request: Request, response: Response): Promise<Response> {
    const result = await authService.signup(request.body as SignupBody);

    setAuthCookie(response, result.token);

    return sendSuccess(response, HTTP_STATUS.CREATED, MESSAGES.AUTH.SIGNUP_SUCCESS, {
      user: result.user,
    });
  }

  async login(request: Request, response: Response): Promise<Response> {
    const result = await authService.login(request.body as LoginBody);

    setAuthCookie(response, result.token);

    return sendSuccess(response, HTTP_STATUS.OK, MESSAGES.AUTH.LOGIN_SUCCESS, {
      user: result.user,
    });
  }

  async me(request: Request, response: Response): Promise<Response> {
    return sendSuccess(response, HTTP_STATUS.OK, MESSAGES.AUTH.FETCH_ME_SUCCESS, {
      user: request.user,
    });
  }
}

export const authController = new AuthController();
