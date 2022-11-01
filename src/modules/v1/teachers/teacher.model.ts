import mongoose from "mongoose";
import validator from "validator";
import { TeacherInput } from "../../../types/interfaces/ITeacher";

export interface TeacherDocument extends TeacherInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Provide the name"],
      trim: true,
      minlength: [
        2,
        "The teacher name must have more or equal than 2 characters",
      ],
    },
    department: {
      type: String,
      required: [true, "Provide the department name"],
      trim: true,
      minlength: [
        2,
        "The teacher's department must have more or equal than 2 characters",
      ],
    },
    email: {
      type: String,
      required: [true, "Provide the email"],
      lowercase: true,
      unique: true,
      validate: [validator.isEmail, "Provide a valid email"],
    },
    position: {
      type: String,
      required: [true, "Provide the position"],
      trim: true,
      minlength: [
        2,
        "The teacher's position must have more or equal than 2 characters",
      ],
    },
    modules: {
      type: [String],
      required: false,
    },
    reviews: {
      type: [String],
      required: false,
    },
    imageNum: {
      type: Number,
      required: true,
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

export const Teacher = mongoose.model<TeacherDocument>(
  "Teacher",
  teacherSchema
);
