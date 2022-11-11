import { CalendarInput } from "@type/interfaces/ICalendar";
import mongoose from "mongoose";

export interface ScheduleDocument extends CalendarInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const scheduleSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Account must belong to an user"],
    },
    days: {
      type: [Object],
      default: [
        {
          type: [Object],
          required: false,
        },
        {
          type: [Object],
          required: false,
        },
        {
          type: [Object],
          required: false,
        },
        {
          type: [Object],
          required: false,
        },
        {
          type: [Object],
          required: false,
        },
        {
          type: [Object],
          required: false,
        },
        {
          type: [Object],
          required: false,
          default: null,
        },
      ],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

scheduleSchema.index({ owner: 1 }, { unique: true });

scheduleSchema.virtual("user", {
  ref: "User",
  foreignField: "_id",
  localField: "owner",
  justOne: true,
});

export const Schedule = mongoose.model<ScheduleDocument>(
  "Schedule",
  scheduleSchema
);
