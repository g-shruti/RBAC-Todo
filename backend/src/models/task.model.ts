import { HydratedDocument, Model, Schema, Types, model } from "mongoose";

export interface Task {
  projectId: Types.ObjectId;
  columnId: Types.ObjectId;
  title: string;
  description?: string;
  order: number;
  assigneeId?: Types.ObjectId;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskDocument = HydratedDocument<Task>;
type TaskModel = Model<Task>;

const taskSchema = new Schema<Task, TaskModel>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    columnId: {
      type: Schema.Types.ObjectId,
      ref: "Column",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    order: {
      type: Number,
      required: true,
      min: 0,
    },
    assigneeId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    dueDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

taskSchema.index({ projectId: 1, columnId: 1, order: 1 });

export const TaskModel = model<Task, TaskModel>("Task", taskSchema);
