import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  JWT_EXPIRES_IN: z.string().min(1).default("7d"),
  CLIENT_ORIGIN: z.string().url("CLIENT_ORIGIN must be a valid URL"),
  COOKIE_DOMAIN: z.string().optional().transform((value) => value?.trim() || undefined),
  COOKIE_SAME_SITE: z.enum(["lax", "strict", "none"]).default("lax"),
  COOKIE_SECURE: z
    .string()
    .optional()
    .transform((value) => value === "true"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const issues = parsedEnv.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join(", ");

  throw new Error(`Invalid environment configuration: ${issues}`);
}

const rawEnv = parsedEnv.data;

export const env = {
  nodeEnv: rawEnv.NODE_ENV,
  port: rawEnv.PORT,
  mongoUri: rawEnv.MONGODB_URI,
  jwtSecret: rawEnv.JWT_SECRET,
  jwtExpiresIn: rawEnv.JWT_EXPIRES_IN,
  clientOrigin: rawEnv.CLIENT_ORIGIN,
  cookieDomain: rawEnv.COOKIE_DOMAIN,
  cookieSameSite: rawEnv.COOKIE_SAME_SITE,
  cookieSecure:
    typeof process.env.COOKIE_SECURE === "string"
      ? rawEnv.COOKIE_SECURE
      : rawEnv.NODE_ENV === "production",
  isProduction: rawEnv.NODE_ENV === "production",
} as const;
