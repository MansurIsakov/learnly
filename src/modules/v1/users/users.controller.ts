import {
  getAll,
  updateOne,
  deleteOne,
} from "../../../common/helpers/handlerFactory.controller";
import { Request, Response, NextFunction } from "express";

import { User } from "./user.model";
import { backResponse, Req } from "../../../types";
import { ModuleErrorCode, UserErrorCode } from "../../../types/errors";
import { ClientErrorException } from "@common/utils/appError";
import { UserModule } from "@type/interfaces/IUser";
import { Module } from "../modules/module.model";
import { env } from "@env";
import { ModuleInput } from "@type/interfaces/IModule";

export const getAllUsers = getAll(User);
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);

// GET User
export const getUser = async (req: Request, res: Response, _: NextFunction) => {
  try {
    const user = await User.findById(req.params.id).populate("schedule");

    if (!user) {
      return backResponse.clientError(res, {
        message: "No user found with that ID",
        code: UserErrorCode.USER_NOT_FOUND,
      });
    }
    backResponse.ok(res, { results: user });
  } catch (error) {
    console.log(1);

    throw new ClientErrorException({
      message: "Failed to find user",
    });
  }
};

// User -> Modules

// Predefined modules
export const addCoreModules = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = await User.findById(res.locals?.user.id);
    const user = await User.findById(userId);

    if (!user) {
      return backResponse.clientError(res, {
        message: "No user found with that ID",
        code: UserErrorCode.USER_NOT_FOUND,
      });
    }

    if (user.modules.length > 0) {
      return backResponse.clientError(res, {
        message: "User already has modules",
        code: UserErrorCode.USER_ALREADY_HAS_MODULES,
      });
    }

    // Add core modules
    const coreModules = await Module.find({
      type: "core",
      moduleLevel: user.level,
      courses: user.course,
    });

    const fixedCoreModules = coreModules.map((module) => {
      return {
        moduleId: module.id,
        moduleName: module.moduleName,
      };
    });

    user.modules = fixedCoreModules;
    user.credits = coreModules.length * +env.CREDITS_PER_MODULE;

    await user.save();

    backResponse.ok(res, { results: user });
  } catch (error) {
    console.log(error);

    throw new ClientErrorException({
      message: "Failed to add core modules",
    });
  }
};

// Add a module to a user
export const addModule = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  try {
    const { moduleId }: UserModule = req.body;

    const user = await User.findById(res.locals?.user.id);

    if (!user) {
      return backResponse.clientError(res, {
        message: "No user found with that ID",
        code: UserErrorCode.USER_NOT_FOUND,
      });
    }

    if (user.credits >= +env.MODULE_CREDITS) {
      return backResponse.clientError(res, {
        message: "User has reached maximum number of credits",
        code: UserErrorCode.USER_MAX_CREDITS,
      });
    }

    const moduleToAdd = await Module.findById(moduleId);

    if (!moduleToAdd) {
      return backResponse.clientError(res, {
        message: "No module found with that ID",
        code: ModuleErrorCode.MODULE_NOT_FOUND,
      });
    }

    if (moduleToAdd.type === "core") {
      return backResponse.clientError(res, {
        message: "User cannot add core modules",
        code: UserErrorCode.USER_ADD_CORE_MODULE,
      });
    }

    if (moduleToAdd.moduleLevel !== +user.level) {
      return backResponse.clientError(res, {
        message: "User cannot add modules of different levels",
        code: UserErrorCode.USER_ADD_DIFFERENT_LEVEL_MODULE,
      });
    }

    if (!moduleToAdd.courses.includes(user.course)) {
      return backResponse.clientError(res, {
        message: "User cannot add modules of different courses",
        code: UserErrorCode.USER_ADD_DIFFERENT_COURSE_MODULE,
      });
    }

    if (user.modules.length > 0) {
      const moduleExists = user.modules.find(
        (userModule) => userModule.moduleId === moduleToAdd.id
      );
      if (moduleExists) {
        return backResponse.clientError(res, {
          message: "User already has this module",
          code: UserErrorCode.USER_ALREADY_HAS_MODULE,
        });
      }
    }

    const fixedModuleToAdd = {
      moduleId: moduleToAdd.id,
      moduleName: moduleToAdd.moduleName,
    };

    user.credits += +env.CREDITS_PER_MODULE;
    user.modules?.push(fixedModuleToAdd);

    await user.save();

    backResponse.ok(res, { results: user });
  } catch (error) {
    throw new ClientErrorException({
      message: "Failed to find user",
    });
  }
};

export const getModules = async (
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

    const moduleIds: string[] = user.modules.map((module) => module.moduleId);

    const modules = await Module.find({
      _id: { $in: moduleIds },
    });

    if (!modules) {
      return backResponse.clientError(res, {
        message: "No modules found",
        code: UserErrorCode.USER_NO_MODULES,
      });
    }

    backResponse.ok(res, {
      results: modules,
      count: modules.length,
      credits: user.credits,
    });
  } catch (error) {
    console.log("Error: " + error);
  }
};

export const deleteModule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { moduleId } = req.body;

    const user = await User.findById(res.locals?.user.id);

    if (!user) {
      return backResponse.clientError(res, {
        message: "No user found with that ID",
        code: UserErrorCode.USER_NOT_FOUND,
      });
    }

    const module = await Module.findById(moduleId);

    if (user.credits <= 0) {
      return backResponse.clientError(res, {
        message: "User has no credits",
        code: UserErrorCode.USER_NO_CREDITS,
      });
    }

    if (module?.type === "core") {
      return backResponse.clientError(res, {
        message: "User cannot delete core modules",
        code: UserErrorCode.USER_REMOVE_CORE_MODULE,
      });
    }

    if (user.modules.includes(module?.id)) {
      return backResponse.clientError(res, {
        message: "User does not have this module",
        code: UserErrorCode.USER_DOES_NOT_HAVE_MODULE,
      });
    }

    for (let i in user.modules) {
      if (user.modules[i].moduleId === moduleId) {
        user.modules.splice(+i, 1);
        user.credits -= +env.CREDITS_PER_MODULE;
        break;
      }
    }

    await user.save();
    backResponse.ok(res, { results: user });
  } catch (error) {
    throw new ClientErrorException({
      message: "Failed to delete module",
    });
  }
};
