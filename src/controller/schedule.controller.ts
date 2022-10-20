import { getAll, createOne } from "./handlerFactory.controller";
import { Schedule } from "../model/schedule.model";

export const getAllSchedules = getAll(Schedule);
export const createSchedule = createOne(Schedule);
