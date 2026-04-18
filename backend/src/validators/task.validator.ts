import { z } from "zod";

const emptyQuerySchema = z.object({});

export const createTaskSchema = z.object({
  body: z
    .object({
      columnId: z.string().trim().min(1),
      title: z.string().trim().min(1).max(200),
      description: z.string().trim().max(2000).optional(),
      dueDate: z.string().date().optional(),
    })
    .strict(),
  params: z
    .object({
      projectId: z.string().trim().min(1),
    })
    .strict(),
  query: emptyQuerySchema,
});

export const updateTaskSchema = z.object({
  body: z
    .object({
      title: z.string().trim().min(1).max(200).optional(),
      description: z.string().trim().max(2000).optional(),
      dueDate: z.string().date().optional(),
    })
    .strict()
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one task field must be provided.",
    }),
  params: z
    .object({
      taskId: z.string().trim().min(1),
    })
    .strict(),
  query: emptyQuerySchema,
});

export const moveTaskSchema = z.object({
  body: z
    .object({
      columnId: z.string().trim().min(1),
      order: z.coerce.number().int().min(0),
    })
    .strict(),
  params: z
    .object({
      taskId: z.string().trim().min(1),
    })
    .strict(),
  query: emptyQuerySchema,
});

export const taskParamsSchema = z.object({
  body: z.object({}).strict(),
  params: z
    .object({
      taskId: z.string().trim().min(1),
    })
    .strict(),
  query: emptyQuerySchema,
});
