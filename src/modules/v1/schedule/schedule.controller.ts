import { ClientErrorException } from "@common/utils/appError";
import { backResponse, ScheduleErrorCode, UserErrorCode } from "@type";
import { Controller } from "@type/controller";
import { CalendarInput } from "@type/interfaces/ICalendar";
import { IClass } from "@type/interfaces/IModule";
import { NextFunction, Request, Response } from "express";
import { User } from "../users/user.model";
import { Schedule } from "./schedule.model";

export const getSchedule: Controller = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  try {
    const user: any = await User.findById(res.locals.user.id).populate({
      path: "schedule",
      select: "_id",
    });

    if (!user) {
      return backResponse.clientError(res, {
        message: "No user found with that ID",
        code: UserErrorCode.USER_NOT_FOUND,
      });
    }

    const scheduleId = user.schedule[0].id;

    let schedule = await Schedule.findById(scheduleId);

    if (!scheduleId) {
      return backResponse.clientError(res, {
        message: `No schedule found with that ID`,
        code: 404,
      });
    }

    backResponse.ok(res, { results: schedule });
  } catch (error) {
    throw new ClientErrorException({
      message: "Failed to find schedule",
    });
  }
};

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

    const days: any[] = req.body.days;

    for (const day in days) {
      // Empty Schedule

      const arr = days[day];

      if (days.every((item) => item.length === 0)) {
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
    const user: any = await User.findById(res.locals?.user.id).populate({
      path: "schedule",
      select: "_id",
    });

    if (!user) {
      return backResponse.clientError(res, {
        message: "No user found with that ID",
        code: UserErrorCode.USER_NOT_FOUND,
      });
    }

    const scheduleId = user.schedule[0].id;

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
          if (arr[i].day === arr[j].day) {
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

    const schedule = await Schedule.findByIdAndUpdate(scheduleId, ...req.body, {
      new: true,
      runValidators: true,
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

export const deleteSchedule: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: any = await User.findById(res.locals?.user.id).populate({
      path: "schedule",
      select: "_id",
    });

    if (!user) {
      return backResponse.clientError(res, {
        message: "No user found with that ID",
        code: UserErrorCode.USER_NOT_FOUND,
      });
    }

    const scheduleId = user.schedule[0].id;

    const schedule = await Schedule.findByIdAndDelete(scheduleId);

    if (!schedule) {
      return backResponse.clientError(res, {
        message: `No schedule found with that ID`,
        code: 404,
      });
    }

    backResponse.deleted(res);
  } catch (error) {
    throw new ClientErrorException({ message: "Failed to delete user" });
  }
};
