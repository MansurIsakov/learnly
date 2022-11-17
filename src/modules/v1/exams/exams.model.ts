import mongoose from "mongoose";
import { ExamInput } from "@type/interfaces/IExam";

export interface ExamDocument extends ExamInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const examSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Account must belong to an user"],
    },
    exams: {
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

examSchema.index({ owner: 1 }, { unique: true });

examSchema.virtual("user", {
  ref: "User",
  foreignField: "_id",
  localField: "owner",
  justOne: true,
});

export const Exam = mongoose.model<ExamDocument>("Exam", examSchema);
