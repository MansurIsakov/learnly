import mongoose from "mongoose";
import { ModuleInput } from "../../../types/interfaces/IModule";

export interface ModuleDocument extends ModuleInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const moduleSchema = new mongoose.Schema(
  {
    moduleLevel: {
      type: Number,
      required: [true, "Provide the course level"],
      trim: true,
    },
    courses: {
      type: [String],
      required: [true, "Provide the course"],
    },
    moduleCode: {
      type: String,
      unique: true,
      required: [true, "Provide the course code"],
      trim: true,
      minlength: [
        2,
        "The course code must have more or equal than 2 characters",
      ],
    },
    moduleName: {
      type: String,
      required: [true, "Provide the course name"],
      trim: true,
      minlength: [
        2,
        "The course name must have more or equal than 2 characters",
      ],
    },
    teachers: {
      type: [String],
      required: [true, "Provide the teachers"],
    },
    classes: {
      type: [Object],
      required: [true, "Provide the classes"],
    },
    credits: {
      type: Number,
      required: [true, "Provide the credits"],
    },
    type: {
      type: String,
      required: [true, "Provide the type"],
      enum: ["core", "optional"],
    },

    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Module = mongoose.model<ModuleDocument>("Module", moduleSchema);
