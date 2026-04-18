export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode?: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, errorCode?: string) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
