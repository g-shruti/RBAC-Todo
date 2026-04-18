import { z } from "zod";

const emptyBodySchema = z.object({});
const emptyQuerySchema = z.object({});

export const createProjectSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(2).max(120),
      description: z.string().trim().max(500).optional(),
    })
    .strict(),
  params: z.object({}).strict(),
  query: emptyQuerySchema,
});

export const projectParamsSchema = z.object({
  body: emptyBodySchema,
  params: z
    .object({
      projectId: z.string().trim().min(1),
    })
    .strict(),
  query: emptyQuerySchema,
});
