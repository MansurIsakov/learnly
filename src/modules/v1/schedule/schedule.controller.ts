import { ClientErrorException } from "@common/utils/appError";
import { backResponse, ScheduleErrorCode, UserErrorCode } from "@type";
import { Controller } from "@type/controller";
import { CalendarInput } from "@type/interfaces/ICalendar";
import { IClass } from "@type/interfaces/IModule";
import { NextFunction, Request, Response } from "express";
import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
} from "../../../common/helpers/handlerFactory.controller";
import { User } from "../users/user.model";
import { Schedule } from "./schedule.model";

export const getAllSchedules = getAll(Schedule);
export const deleteSchedule = deleteOne(Schedule);
export const getSchedule = getOne(Schedule);

export const createSchedule: Controller = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  try {
    const user = await User.findById(res.locals?.user.id);

    if (!user) {
      return backResponse.clientError(res, {
        message: "No user found with that ID",
        code: UserErrorCode.USER_NOT_FOUND,
      });
    }

    const days: any[] = { ...req.body };

    for (const day in days) {
      // Empty Schedule
      const arr = days[day];

      if (arr.some((item: CalendarInput) => item === null)) {
        return backResponse.clientError(res, {
          message: "You cannot submit an empty schedule",
          code: ScheduleErrorCode.NO_CLASSES_FOUND,
        });
      }

      // Check for duplicates time && time collisions
      let hasDuplicate = false;
      let hasCollisions = false;
      let hasInvalidDate = false;

      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          if (arr[i].day !== arr[j].day) {
            hasInvalidDate = true;
            break;
          }

          if (arr[i].time === arr[j].time) {
            hasDuplicate = true;
            break;
          }

          if (
            +arr[i].time - +arr[j].time === 1 ||
            +arr[j].time - +arr[i].time === -1
          ) {
            hasCollisions = true;
            break;
          }
        }
      }

      if (hasDuplicate) {
        return backResponse.clientError(res, {
          message: "You cannot submit a schedule with duplicate classes",
          code: ScheduleErrorCode.NO_CLASSES_FOUND,
        });
      }

      if (hasCollisions) {
        return backResponse.clientError(res, {
          message: "You have time collisions in your schedule",
          code: ScheduleErrorCode.CLASS_COLLISION,
        });
      }

      if (hasInvalidDate) {
        return backResponse.clientError(res, {
          message: "You have invalid dates in your schedule",
          code: ScheduleErrorCode.INVALID_DATE,
        });
      }
    }

    const schedule = await Schedule.create({
      owner: user?.id,
      ...req.body,
    });

    backResponse.created(res, { results: schedule });
  } catch (error: any) {
    if (error.code === 11000) {
      return backResponse.clientError(res, {
        message: "The schedule for this user is already exists",
        code: ScheduleErrorCode.SCHEDULE_ALREADY_EXISTS,
      });
    }

    if (error.message) {
      return backResponse.clientError(res, {
        message: error.message,
        code: "UKNOWN",
      });
    }

    throw new ClientErrorException({ message: "Failed to create item" });
  }
};

export const updateSchedule: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(res.locals?.user.id);

    if (!user) {
      return backResponse.clientError(res, {
        message: "No user found with that ID",
        code: UserErrorCode.USER_NOT_FOUND,
      });
    }

    const days: any[] = { ...req.body };

    for (const day in days) {
      // Empty Schedule
      const arr = days[day];

      if (arr.some((item: CalendarInput) => item === null)) {
        return backResponse.clientError(res, {
          message: "You cannot submit an empty schedule",
          code: ScheduleErrorCode.NO_CLASSES_FOUND,
        });
      }

      // Check for duplicates time && time collisions
      let hasDuplicate = false;
      let hasCollisions = false;
      let hasInvalidDate = false;

      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          if (arr[i].day !== arr[j].day) {
            hasInvalidDate = true;
            break;
          }

          if (arr[i].time === arr[j].time) {
            hasDuplicate = true;
            break;
          }

          if (
            +arr[i].time - +arr[j].time === 1 ||
            +arr[j].time - +arr[i].time === -1
          ) {
            hasCollisions = true;
            break;
          }
        }
      }

      if (hasDuplicate) {
        return backResponse.clientError(res, {
          message: "You cannot submit a schedule with duplicate classes",
          code: ScheduleErrorCode.NO_CLASSES_FOUND,
        });
      }

      if (hasCollisions) {
        return backResponse.clientError(res, {
          message: "You have time collisions in your schedule",
          code: ScheduleErrorCode.CLASS_COLLISION,
        });
      }

      if (hasInvalidDate) {
        return backResponse.clientError(res, {
          message: "You have invalid dates in your schedule",
          code: ScheduleErrorCode.INVALID_DATE,
        });
      }
    }

    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      ...req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    backResponse.created(res, { results: schedule });
  } catch (error: any) {
    if (error.code === 11000) {
      return backResponse.clientError(res, {
        message: "The schedule for this user is already exists",
        code: ScheduleErrorCode.SCHEDULE_ALREADY_EXISTS,
      });
    }

    if (error.message) {
      return backResponse.clientError(res, {
        message: error.message,
        code: "UKNOWN",
      });
    }

    throw new ClientErrorException({ message: "Failed to create item" });
  }
};
