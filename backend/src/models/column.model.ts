import { HydratedDocument, Model, Schema, Types, model } from "mongoose";

export interface Column {
  projectId: Types.ObjectId;
  name: string;
  key: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ColumnDocument = HydratedDocument<Column>;
type ColumnModel = Model<Column>;

const columnSchema = new Schema<Column, ColumnModel>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    key: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    order: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

columnSchema.index({ projectId: 1, key: 1 }, { unique: true });
columnSchema.index({ projectId: 1, order: 1 });

export const ColumnModel = model<Column, ColumnModel>("Column", columnSchema);
