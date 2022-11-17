import { Router, Request, Response, NextFunction } from "express";

import authRouter from "./v1/auth/auth.route";
import usersRouter from "./v1/users/users.route";
import teachersRouter from "./v1/teachers/teachers.route";
import modulesRouter from "./v1/modules/modules.route";
import scheduleRouter from "./v1/schedule/schedule.route";
import userModulesRouter from "./v1/users/userModules.route";
import examsRouter from "./v1/exams/exams.route";
import tasksRouter from "./v1/tasks/tasks.route";

const router = Router();

/**
 * @route  api/v1
 */

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/teachers", teachersRouter);
router.use("/modules", modulesRouter);
router.use("/schedule", scheduleRouter);
router.use("/user/modules", userModulesRouter);
router.use("/exams", examsRouter);
router.use("/tasks", tasksRouter);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "Server v1 is up and running",
  });
});

export default router;
