import mongoose from "mongoose";
import { TaskInput } from "@type/interfaces/ITask";

export interface TaskDocument extends TaskInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Account must belong to an user"],
    },
    tasks: {
      type: [Object],
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

taskSchema.index({ owner: 1 }, { unique: true });

taskSchema.virtual("user", {
  ref: "User",
  foreignField: "_id",
  localField: "owner",
  justOne: true,
});

export const Task = mongoose.model<TaskDocument>("Task", taskSchema);
