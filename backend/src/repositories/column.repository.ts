import { Types } from "mongoose";

import { ColumnDocument, ColumnModel } from "../models/column.model";

interface CreateColumnInput {
  projectId: Types.ObjectId;
  name: string;
  key: string;
  order: number;
}

class ColumnRepository {
  async createMany(payload: CreateColumnInput[]): Promise<ColumnDocument[]> {
    return ColumnModel.insertMany(payload);
  }

  async findByProject(projectId: string): Promise<ColumnDocument[]> {
    return ColumnModel.find({ projectId }).sort({ order: 1 }).exec();
  }

  async findById(columnId: string): Promise<ColumnDocument | null> {
    return ColumnModel.findById(columnId).exec();
  }
}

export const columnRepository = new ColumnRepository();
