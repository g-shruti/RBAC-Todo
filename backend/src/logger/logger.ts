type LogLevel = "INFO" | "ERROR" | "WARN";

const formatMessage = (level: LogLevel, message: string, meta?: unknown): string => {
  const timestamp = new Date().toISOString();
  const serializedMeta = meta ? ` ${JSON.stringify(meta)}` : "";

  return `[${timestamp}] [${level}] ${message}${serializedMeta}`;
};

export const logger = {
  info: (message: string, meta?: unknown): void => {
    console.log(formatMessage("INFO", message, meta));
  },
  warn: (message: string, meta?: unknown): void => {
    console.warn(formatMessage("WARN", message, meta));
  },
  error: (message: string, meta?: unknown): void => {
    console.error(formatMessage("ERROR", message, meta));
  },
};
