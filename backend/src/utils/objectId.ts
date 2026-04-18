import { isValidObjectId } from "mongoose";

import { HTTP_STATUS } from "../constants/httpStatus";
import { AppError } from "./appError";

export const ensureValidObjectId = (value: string, message = "Invalid resource identifier."): void => {
  if (!isValidObjectId(value)) {
    throw new AppError(message, HTTP_STATUS.BAD_REQUEST, "INVALID_ID");
  }
};
