import { Router } from "express";
import * as authController from "../controller/auth.controller";
import * as teachersController from "../controller/teachers.controller";

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
