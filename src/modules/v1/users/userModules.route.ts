import { Router } from "express";
import * as authController from "../auth/auth.controller";
import * as userController from "./users.controller";

const router: Router = Router();

/**
 * @route   api/v1/user/modules
 */

// User -> Modules
router
  .route("/")
  .get(authController.protect, userController.getModules)
  .post(authController.protect, userController.addModule)
  .delete(authController.protect, userController.deleteModule);

// User -> Modules -> Core
router
  .route("/core")
  .get(authController.protect, userController.addCoreModules);

export default router;
