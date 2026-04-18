import mongoose from "mongoose";

import { env } from "./env";
import { logger } from "../logger/logger";

export const connectDatabase = async (): Promise<void> => {
  await mongoose.connect(env.mongoUri);
  logger.info(`Database connected: ${mongoose.connection.name}`);
};
