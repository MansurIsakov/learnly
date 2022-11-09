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
      ref: "User",
      required: [true, "Account must belong to an user"],
    },
    monday: {
      type: [Object],
      required: false,
    },
    tuesday: {
      type: [Object],
      required: false,
    },
    wednesday: {
      type: [Object],
      required: false,
    },
    thursday: {
      type: [Object],
      required: false,
    },
    friday: {
      type: [Object],
      required: false,
    },
    saturday: {
      type: [Object],
      required: false,
    },
    sunday: {
      type: [Object],
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

scheduleSchema.index({ owner: 1 }, { unique: true });

scheduleSchema.pre(/^find/, function (next): void {
  this.populate({
    path: "owner",
    select: "_id",
  });
  next();
});

export const Schedule = mongoose.model<ScheduleDocument>(
  "Schedule",
  scheduleSchema
);
