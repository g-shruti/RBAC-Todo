import { z } from "zod";

const signupBodySchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    email: z.email().transform((value) => value.toLowerCase()),
    password: z.string().min(8).max(72),
  })
  .strict();

const loginBodySchema = z
  .object({
    email: z.email().transform((value) => value.toLowerCase()),
    password: z.string().min(8).max(72),
  })
  .strict();

const emptyObjectSchema = z.object({});

export const signupSchema = z.object({
  body: signupBodySchema,
  params: emptyObjectSchema,
  query: emptyObjectSchema,
});

export const loginSchema = z.object({
  body: loginBodySchema,
  params: emptyObjectSchema,
  query: emptyObjectSchema,
});
