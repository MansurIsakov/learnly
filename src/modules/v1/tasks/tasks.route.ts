import { Router } from "express";
import * as authController from "../auth/auth.controller";
import * as tasksController from "./tasks.controller";

const router: Router = Router();

/**
 * @route   api/v1/tasks
 */

router.use(authController.protect);

// Tasks
router.route("/").get(tasksController.getTasks).post(tasksController.addTask);

// Task
router
  .route("/:id")
  .put(tasksController.updateTask)
  .delete(tasksController.deleteTask);

export default router;
