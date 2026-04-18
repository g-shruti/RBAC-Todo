import { Types } from "mongoose";

import { DEFAULT_PROJECT_COLUMNS } from "../constants/project";
import { HTTP_STATUS } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";
import { columnRepository } from "../repositories/column.repository";
import { projectRepository } from "../repositories/project.repository";
import { taskRepository } from "../repositories/task.repository";
import { AppError } from "../utils/appError";
import { ensureValidObjectId } from "../utils/objectId";

interface CreateProjectInput {
  name: string;
  description?: string;
}

const toProjectResponse = (project: {
  _id: { toString(): string };
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}) => ({
  id: project._id.toString(),
  name: project.name,
  description: project.description,
  createdAt: project.createdAt,
  updatedAt: project.updatedAt,
});

class ProjectService {
  async getProjects(userId: string) {
    const projects = await projectRepository.findByOwner(userId);

    return projects.map((project) => toProjectResponse(project));
  }

  async createProject(userId: string, payload: CreateProjectInput) {
    const normalizedName = payload.name.trim();

    if (await projectRepository.existsByOwnerAndName(userId, normalizedName)) {
      throw new AppError(MESSAGES.PROJECT.DUPLICATE_NAME, HTTP_STATUS.CONFLICT, "PROJECT_ALREADY_EXISTS");
    }

    const project = await projectRepository.create({
      ownerId: new Types.ObjectId(userId),
      name: normalizedName,
      description: payload.description?.trim() || undefined,
    });

    await columnRepository.createMany(
      DEFAULT_PROJECT_COLUMNS.map((column) => ({
        projectId: project._id,
        key: column.key,
        name: column.name,
        order: column.order,
      })),
    );

    return toProjectResponse(project);
  }

  async getProject(userId: string, projectId: string) {
    ensureValidObjectId(projectId, "Invalid project identifier.");

    const project = await projectRepository.findByIdAndOwner(projectId, userId);

    if (!project) {
      throw new AppError(MESSAGES.PROJECT.NOT_FOUND, HTTP_STATUS.NOT_FOUND, "PROJECT_NOT_FOUND");
    }

    return toProjectResponse(project);
  }

  async getBoard(userId: string, projectId: string) {
    const project = await this.getProject(userId, projectId);

    const [columns, tasks] = await Promise.all([
      columnRepository.findByProject(projectId),
      taskRepository.findByProject(projectId),
    ]);

    return {
      project,
      columns: columns.map((column) => ({
        id: column.id,
        projectId: column.projectId.toString(),
        name: column.name,
        key: column.key,
        order: column.order,
      })),
      tasks: tasks.map((task) => ({
        id: task.id,
        projectId: task.projectId.toString(),
        columnId: task.columnId.toString(),
        title: task.title,
        description: task.description,
        order: task.order,
        assigneeId: task.assigneeId?.toString(),
        dueDate: task.dueDate,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      })),
    };
  }
}

export const projectService = new ProjectService();
