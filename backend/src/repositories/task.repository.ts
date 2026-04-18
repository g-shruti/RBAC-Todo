import { FilterQuery, UpdateQuery } from "mongoose";

import { TaskDocument, TaskModel } from "../models/task.model";

interface CreateTaskInput {
  projectId: string;
  columnId: string;
  title: string;
  description?: string;
  order: number;
  dueDate?: Date;
}

class TaskRepository {
  async create(payload: CreateTaskInput): Promise<TaskDocument> {
    return TaskModel.create(payload);
  }

  async findByProject(projectId: string): Promise<TaskDocument[]> {
    return TaskModel.find({ projectId }).sort({ order: 1, createdAt: 1 }).exec();
  }

  async findById(taskId: string): Promise<TaskDocument | null> {
    return TaskModel.findById(taskId).exec();
  }

  async updateById(taskId: string, payload: UpdateQuery<TaskDocument>): Promise<TaskDocument | null> {
    return TaskModel.findByIdAndUpdate(taskId, payload, { new: true }).exec();
  }

  async deleteById(taskId: string): Promise<void> {
    await TaskModel.findByIdAndDelete(taskId).exec();
  }

  async countByColumn(columnId: string): Promise<number> {
    return TaskModel.countDocuments({ columnId }).exec();
  }

  async findByColumn(columnId: string): Promise<TaskDocument[]> {
    return TaskModel.find({ columnId }).sort({ order: 1, createdAt: 1 }).exec();
  }

  async updateMany(filter: FilterQuery<TaskDocument>, payload: UpdateQuery<TaskDocument>): Promise<void> {
    await TaskModel.updateMany(filter, payload).exec();
  }
}

export const taskRepository = new TaskRepository();
