import { Router } from "express";

import { taskController } from "../controllers/task.controller";
import { asyncHandler } from "../middleware/asyncHandler";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { moveTaskSchema, taskParamsSchema, updateTaskSchema } from "../validators/task.validator";

const taskRouter = Router();

taskRouter.use(authMiddleware);

taskRouter.patch("/:taskId", validate(updateTaskSchema), asyncHandler(taskController.updateTask.bind(taskController)));
taskRouter.patch("/:taskId/move", validate(moveTaskSchema), asyncHandler(taskController.moveTask.bind(taskController)));
taskRouter.delete("/:taskId", validate(taskParamsSchema), asyncHandler(taskController.deleteTask.bind(taskController)));

export { taskRouter };
