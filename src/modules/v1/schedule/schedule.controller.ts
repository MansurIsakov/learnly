import { ClientErrorException } from "@common/utils/appError";
import { backResponse, ScheduleErrorCode, UserErrorCode } from "@type";
import { Controller } from "@type/controller";
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

export const updateSchedule = updateOne(Schedule);
