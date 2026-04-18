import { Router } from "express";

import { projectController } from "../controllers/project.controller";
import { taskController } from "../controllers/task.controller";
import { asyncHandler } from "../middleware/asyncHandler";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createProjectSchema, projectParamsSchema } from "../validators/project.validator";
import { createTaskSchema } from "../validators/task.validator";

const projectRouter = Router();

projectRouter.use(authMiddleware);

projectRouter.get("/", asyncHandler(projectController.getProjects.bind(projectController)));
projectRouter.post("/", validate(createProjectSchema), asyncHandler(projectController.createProject.bind(projectController)));
projectRouter.get(
  "/:projectId/board",
  validate(projectParamsSchema),
  asyncHandler(projectController.getBoard.bind(projectController)),
);
projectRouter.post(
  "/:projectId/tasks",
  validate(createTaskSchema),
  asyncHandler(taskController.createTask.bind(taskController)),
);
projectRouter.get("/:projectId", validate(projectParamsSchema), asyncHandler(projectController.getProject.bind(projectController)));

export { projectRouter };
