import { Router } from "express";
import { protect } from "../auth/auth.controller";
import * as scheduleController from "./schedule.controller";

const router: Router = Router();

/**
 * @route   api/v1/schedule
 */

// Schedule
router
  .route("/")
  .post(protect, scheduleController.createSchedule)
  .get(protect, scheduleController.getSchedule)
  .put(protect, scheduleController.updateSchedule)
  .delete(protect, scheduleController.deleteSchedule);

export default router;
