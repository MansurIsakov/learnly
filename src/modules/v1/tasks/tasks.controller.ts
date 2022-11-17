import { ClientErrorException } from "@common/utils/appError";
import { backResponse, UserErrorCode, TaskErrorCode } from "@type";
import { Controller } from "@type/controller";
import { Request, Response, NextFunction } from "express";
import { User } from "../users/user.model";
import mongoose from "mongoose";
import { Task } from "./tasks.model";
import { TaskStatus } from "@type/task";

export const getTasks: Controller = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  try {
    const user: any = await User.findById(res.locals.user.id);

    if (!user) {
      return backResponse.clientError(res, {
        message: "No user found with that ID",
        code: UserErrorCode.USER_NOT_FOUND,
      });
    }

    let taskData = await Task.findOne({ owner: user.id });

    if (!taskData) {
      taskData = await Task.create({ owner: user.id });
    }

    backResponse.ok(res, { results: taskData.tasks });
  } catch (error: any) {
    throw new ClientErrorException({
      message: "Failed to find tasks",
    });
  }
};

export const addTask: Controller = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  try {
    const user: any = await User.findById(res.locals.user.id);

    if (!user) {
      return backResponse.clientError(res, {
        message: "No user found with that ID",
        code: UserErrorCode.USER_NOT_FOUND,
      });
    }

    let taskData = await Task.findOne({ owner: user.id });

    if (!taskData) {
      taskData = await Task.create({ owner: user.id });
    }

    const taskId = new mongoose.Types.ObjectId();

    taskData.tasks.push({
      id: taskId,
      ...req.body,
      taskStatus: TaskStatus.NEW,
    });

    await taskData.save();

    backResponse.created(res, { results: taskData.tasks });
  } catch (error: any) {
    throw new ClientErrorException({
      message: "Failed to add task",
    });
  }
};

export const updateTask: Controller = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  try {
    const user: any = await User.findById(res.locals.user.id);
    if (!user) {
      return backResponse.clientError(res, {
        message: "No user found with that ID",
        code: UserErrorCode.USER_NOT_FOUND,
      });
    }
    const taskData = await Task.findOne({ owner: user.id });

    if (!taskData) {
      return backResponse.clientError(res, {
        message: "User does not have any tasks",
        code: TaskErrorCode.TASK_NOT_FOUND,
      });
    }

    const taskIndex = taskData.tasks.findIndex(
      (task: any) => task.id == req.params.id
    );

    if (taskIndex === -1) {
      return backResponse.clientError(res, {
        message: "No task found with that ID",
        code: TaskErrorCode.TASK_NOT_FOUND,
      });
    }

    taskData.tasks[taskIndex] = {
      id: taskData.tasks[taskIndex].id,
      ...req.body,
    };

    await taskData.save();

    backResponse.ok(res, { results: taskData.tasks });
  } catch (error: any) {
    throw new ClientErrorException({
      message: "Failed to add task",
    });
  }
};

export const deleteTask: Controller = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  try {
    const user: any = await User.findById(res.locals.user.id);

    if (!user) {
      return backResponse.clientError(res, {
        message: "No user found with that ID",
        code: UserErrorCode.USER_NOT_FOUND,
      });
    }

    const taskData = await Task.findOne({ owner: user.id });

    if (!taskData) {
      return backResponse.clientError(res, {
        message: "User does not have any tasks",
        code: TaskErrorCode.TASK_NOT_FOUND,
      });
    }

    const taskId = req.params.id;

    const isTaskIdValid = taskData.tasks.some((task: any) => task.id == taskId);

    if (!isTaskIdValid) {
      return backResponse.clientError(res, {
        message: "No task found with that ID",
        code: TaskErrorCode.TASK_NOT_FOUND,
      });
    }

    taskData.tasks = taskData.tasks.filter((task: any) => task.id != taskId);

    await taskData.save();

    backResponse.deleted(res);
  } catch (error: any) {
    throw new ClientErrorException({
      message: "Failed to delete task",
    });
  }
};
