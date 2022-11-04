import { Router } from "express";
import * as authController from "../auth/auth.controller";
import * as userController from "./users.controller";

const router: Router = Router();

/**
 * @route   api/v1/users
 */

// Users
router.route("/").get(userController.getAllUsers);

// User
router
  .route("/:id")
  .get(authController.protect, userController.getUser)
  .delete(authController.protect, userController.deleteUser)
  .put(userController.updateUser);

// User -> Modules
router
  .route("/:id/modules")
  .get(authController.protect, userController.getModules)
  .post(authController.protect, userController.addModule)
  .delete(authController.protect, userController.deleteModule);

// User -> Modules -> Core
router
  .route("/:id/modules/core")
  .get(authController.protect, userController.addCoreModules);

export default router;
