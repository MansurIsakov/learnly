import { Router } from "express";
import * as authController from "../auth/auth.controller";
import * as examsController from "./exams.controller";

const router: Router = Router();

/**
 * @route   api/v1/exams
 */

router.use(authController.protect);

// Exams
router.route("/").get(examsController.getExams).post(examsController.addExam);

// Exam
router
  .route("/:id")
  .put(examsController.updateExam)
  .delete(examsController.deleteExam);

export default router;
