import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import { corsOptions } from "./config/cors";
import { HTTP_STATUS } from "./constants/httpStatus";
import { MESSAGES } from "./constants/messages";
import { errorHandler } from "./middleware/error.middleware";
import { globalRateLimiter } from "./middleware/rateLimit.middleware";
import { requestLogger } from "./middleware/requestLogger.middleware";
import { sanitizeRequest } from "./middleware/sanitize.middleware";
import { authRouter } from "./routes/auth.routes";
import { projectRouter } from "./routes/project.routes";
import { taskRouter } from "./routes/task.routes";
import { AppError } from "./utils/appError";

const app = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(cors(corsOptions));
app.use(requestLogger);
app.use(globalRateLimiter);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(sanitizeRequest);

app.get("/health", (_request, response) => {
  response.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.APP.HEALTH_OK,
    data: null,
  });
});

app.use("/api/auth", authRouter);
app.use("/api/projects", projectRouter);
app.use("/api/tasks", taskRouter);

app.use((request, _response, next) => {
  next(new AppError(`Route ${request.originalUrl} not found.`, HTTP_STATUS.NOT_FOUND, "ROUTE_NOT_FOUND"));
});

app.use(errorHandler);

export { app };
