import { HTTP_STATUS } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";
import { columnRepository } from "../repositories/column.repository";
import { projectRepository } from "../repositories/project.repository";
import { taskRepository } from "../repositories/task.repository";
import { AppError } from "../utils/appError";
import { ensureValidObjectId } from "../utils/objectId";

interface CreateTaskInput {
  columnId: string;
  title: string;
  description?: string;
  dueDate?: string;
}

interface UpdateTaskInput {
  title?: string;
  description?: string;
  dueDate?: string;
}

interface MoveTaskInput {
  columnId: string;
  order: number;
}

const normalizeTaskResponse = (task: {
  _id: { toString(): string };
  projectId: { toString(): string };
  columnId: { toString(): string };
  title: string;
  description?: string;
  order: number;
  assigneeId?: { toString(): string } | null;
  dueDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}) => ({
  id: task._id.toString(),
  projectId: task.projectId.toString(),
  columnId: task.columnId.toString(),
  title: task.title,
  description: task.description,
  order: task.order,
  assigneeId: task.assigneeId?.toString(),
  dueDate: task.dueDate,
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,
});

class TaskService {
  private async ensureOwnedProject(projectId: string, userId: string) {
    ensureValidObjectId(projectId, "Invalid project identifier.");

    const project = await projectRepository.findByIdAndOwner(projectId, userId);

    if (!project) {
      throw new AppError(MESSAGES.PROJECT.NOT_FOUND, HTTP_STATUS.NOT_FOUND, "PROJECT_NOT_FOUND");
    }

    return project;
  }

  private async ensureProjectColumn(columnId: string, projectId: string) {
    ensureValidObjectId(columnId, "Invalid column identifier.");

    const column = await columnRepository.findById(columnId);

    if (!column || column.projectId.toString() !== projectId) {
      throw new AppError(MESSAGES.TASK.INVALID_COLUMN, HTTP_STATUS.BAD_REQUEST, "INVALID_COLUMN");
    }

    return column;
  }

  private async ensureOwnedTask(taskId: string, userId: string) {
    ensureValidObjectId(taskId, "Invalid task identifier.");

    const task = await taskRepository.findById(taskId);

    if (!task) {
      throw new AppError(MESSAGES.TASK.NOT_FOUND, HTTP_STATUS.NOT_FOUND, "TASK_NOT_FOUND");
    }

    await this.ensureOwnedProject(task.projectId.toString(), userId);

    return task;
  }

  async createTask(userId: string, projectId: string, payload: CreateTaskInput) {
    await this.ensureOwnedProject(projectId, userId);
    await this.ensureProjectColumn(payload.columnId, projectId);

    const order = await taskRepository.countByColumn(payload.columnId);

    const task = await taskRepository.create({
      projectId,
      columnId: payload.columnId,
      title: payload.title.trim(),
      description: payload.description?.trim() || undefined,
      dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
      order,
    });

    return normalizeTaskResponse(task);
  }

  async updateTask(userId: string, taskId: string, payload: UpdateTaskInput) {
    const task = await this.ensureOwnedTask(taskId, userId);

    const updatedTask = await taskRepository.updateById(task.id, {
      title: payload.title?.trim() ?? task.title,
      description: payload.description?.trim() || undefined,
      dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
    });

    if (!updatedTask) {
      throw new AppError(MESSAGES.TASK.NOT_FOUND, HTTP_STATUS.NOT_FOUND, "TASK_NOT_FOUND");
    }

    return normalizeTaskResponse(updatedTask);
  }

  async moveTask(userId: string, taskId: string, payload: MoveTaskInput) {
    const task = await this.ensureOwnedTask(taskId, userId);
    await this.ensureProjectColumn(payload.columnId, task.projectId.toString());

    const sourceTasks = await taskRepository.findByColumn(task.columnId.toString());
    const destinationTasks =
      payload.columnId === task.columnId.toString()
        ? sourceTasks
        : await taskRepository.findByColumn(payload.columnId);

    const sourceWithoutTask = sourceTasks.filter((item) => item.id !== task.id);
    const boundedOrder = Math.max(0, Math.min(payload.order, destinationTasks.length));

    if (payload.columnId === task.columnId.toString()) {
      const reorderedTasks = [...sourceWithoutTask];
      reorderedTasks.splice(boundedOrder, 0, task);

      await Promise.all(
        reorderedTasks.map((item, index) =>
          taskRepository.updateById(item.id, {
            columnId: payload.columnId,
            order: index,
          }),
        ),
      );
    } else {
      const updatedDestination = [...destinationTasks];
      updatedDestination.splice(boundedOrder, 0, task);

      await Promise.all([
        ...sourceWithoutTask.map((item, index) =>
          taskRepository.updateById(item.id, {
            order: index,
          }),
        ),
        ...updatedDestination.map((item, index) =>
          taskRepository.updateById(item.id, {
            columnId: payload.columnId,
            order: index,
          }),
        ),
      ]);
    }

    const updatedTask = await taskRepository.findById(task.id);

    if (!updatedTask) {
      throw new AppError(MESSAGES.TASK.NOT_FOUND, HTTP_STATUS.NOT_FOUND, "TASK_NOT_FOUND");
    }

    return normalizeTaskResponse(updatedTask);
  }

  async deleteTask(userId: string, taskId: string) {
    const task = await this.ensureOwnedTask(taskId, userId);
    const sourceTasks = await taskRepository.findByColumn(task.columnId.toString());

    await taskRepository.deleteById(task.id);

    const remainingTasks = sourceTasks.filter((item) => item.id !== task.id);

    await Promise.all(
      remainingTasks.map((item, index) =>
        taskRepository.updateById(item.id, {
          order: index,
        }),
      ),
    );
  }
}

export const taskService = new TaskService();
