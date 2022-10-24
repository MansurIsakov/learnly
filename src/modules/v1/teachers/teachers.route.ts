import { Router } from "express";
import * as authController from "../auth/auth.controller";
import * as teachersController from "./teachers.controller";

const router: Router = Router();

/**
 * @route   api/v1/teachers
 */

// Teachers
router
  .route("/")
  .post(teachersController.createTeacher)
  .get(teachersController.getAllTeachers);

// Teacher
router
  .route("/:id")
  .get(authController.protect, teachersController.getTeacher)
  .delete(authController.protect, teachersController.deleteTeacher)
  .put(teachersController.updateTeacher);

export default router;
