import { Router } from "express";
import * as authController from "../auth/auth.controller";
import * as userController from "./users.controller";

const router: Router = Router();

/**
 * @route   api/v1/users
 */

// Users
router
  .route("/")
  .post(userController.createUser)
  .get(userController.getAllUsers);

// User
router
  .route("/:id")
  .get(authController.protect, userController.getUser)
  .delete(authController.protect, userController.deleteUser)
  .put(userController.updateUser);

export default router;
