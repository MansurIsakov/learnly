import { Router } from "express";
import * as scheduleController from "../controller/schedule.controller";

const router: Router = Router();

/**
 * @route   api/v1/schedule
 */

// Schedule
router
  .route("/")
  .post(scheduleController.createSchedule)
  .get(scheduleController.getAllSchedules);

export default router;
