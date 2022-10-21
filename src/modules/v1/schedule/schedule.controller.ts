import { getAll, createOne } from "../../../helpers/handlerFactory.controller";
import { Schedule } from "./schedule.model";

export const getAllSchedules = getAll(Schedule);
export const createSchedule = createOne(Schedule);
