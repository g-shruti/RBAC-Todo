import { app } from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";
import { logger } from "./logger/logger";

let server: ReturnType<typeof app.listen> | undefined;

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    server = app.listen(env.port, () => {
      logger.info(`Server listening on port ${env.port}`);
    });
  } catch (error) {
    logger.error("Failed to start server", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    process.exit(1);
  }
};

const shutdown = (signal: string): void => {
  logger.info(`Received ${signal}. Shutting down gracefully.`);

  if (!server) {
    process.exit(0);
  }

  server.close(() => {
    process.exit(0);
  });
};

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled promise rejection", reason);
  shutdown("unhandledRejection");
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception", {
    message: error.message,
    stack: error.stack,
  });
  shutdown("uncaughtException");
});

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

void startServer();
