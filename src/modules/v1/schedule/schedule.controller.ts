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

    const days = [[], [], [], [], [], [], []];

    const schedule = await Schedule.create({
      owner: user?.id,
      days,
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

    if (!scheduleId) {
      return backResponse.clientError(res, {
        message: `No schedule found with that ID`,
        code: 404,
      });
    }

    const userSchedule = await Schedule.findById<CalendarInput>(scheduleId);

    if (!userSchedule) {
      return backResponse.clientError(res, {
        message: `No schedule found with that ID`,
        code: 404,
      });
    }

    const moduleClass: IClass = req.body;

    // Empty Body
    if (Object.keys(req.body).length === 0) {
      return backResponse.clientError(res, {
        message: "You cannot submit an empty schedule",
        code: ScheduleErrorCode.NO_CLASSES_FOUND,
      });
    }

    const arr = userSchedule.days;

    for (const day of arr) {
      // Check for duplicates time && time collisions
      let hasDuplicate = false;
      let hasCollisions = false;

      arr.forEach((day) => {
        day.forEach((item) => {
          if (item.day === moduleClass.day && item.time === moduleClass.time) {
            hasDuplicate = true;
          }

          if (
            (item.day === moduleClass.day &&
              Number(moduleClass.time) - Number(item.time) === 1) ||
            (item.day === moduleClass.day &&
              Number(moduleClass.time) - Number(item.time) === -1)
          ) {
            hasCollisions = true;
          }

          console.log("ITEM TIME: " + item.time);
          console.log("MODULE TIME: " + moduleClass.time);
        });
      });

      if (hasDuplicate) {
        return backResponse.clientError(res, {
          message: "You cannot add classes with the same time",
          code: ScheduleErrorCode.NO_CLASSES_FOUND,
        });
      }
      if (hasCollisions) {
        return backResponse.clientError(res, {
          message: "You have time collisions in your schedule",
          code: ScheduleErrorCode.CLASS_COLLISION,
        });
      }
    }

    let moduleClassday;

    switch (moduleClass.day) {
      case "monday":
        moduleClassday = 0;
        break;
      case "tuesday":
        moduleClassday = 1;
        break;
      case "wednesday":
        moduleClassday = 2;
        break;
      case "thursday":
        moduleClassday = 3;
        break;
      case "friday":
        moduleClassday = 4;
        break;
      case "saturday":
        moduleClassday = 5;
        break;
      case "sunday":
        moduleClassday = 6;
        break;
      default:
        moduleClassday = 0;
        break;
    }

    userSchedule.days[moduleClassday].push(moduleClass);

    const schedule = await Schedule.findByIdAndUpdate(
      scheduleId,
      userSchedule,
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
