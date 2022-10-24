import {
  getAll,
  createOne,
} from "../../../common/helpers/handlerFactory.controller";
import { Schedule } from "./schedule.model";

export const getAllSchedules = getAll(Schedule);
export const createSchedule = createOne(Schedule);
