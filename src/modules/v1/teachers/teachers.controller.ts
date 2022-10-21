import {
  getAll,
  updateOne,
  deleteOne,
  createOne,
  getOne,
} from "../../../helpers/handlerFactory.controller";
import { Teacher } from "./teacher.model";

export const getAllTeachers = getAll(Teacher);
export const updateTeacher = updateOne(Teacher);
export const deleteTeacher = deleteOne(Teacher);
export const createTeacher = createOne(Teacher);
export const getTeacher = getOne(Teacher);
