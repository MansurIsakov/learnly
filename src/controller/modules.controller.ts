import {
  getAll,
  updateOne,
  deleteOne,
  createOne,
  getOne,
} from "./handlerFactory.controller";
import { Module } from "../model/module.model";

export const getAllModules = getAll(Module);
export const updateModule = updateOne(Module);
export const deleteModule = deleteOne(Module);
export const createModule = createOne(Module);
export const getModule = getOne(Module);
