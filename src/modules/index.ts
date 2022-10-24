import { Router, Request, Response, NextFunction } from "express";

import authRouter from "./v1/auth/auth.route";
import usersRouter from "./v1/users/users.route";
import teachersRouter from "./v1/teachers/teachers.route";
import modulesRouter from "./v1/modules/modules.route";
import scheduleRouter from "./v1/schedule/schedule.route";

const router = Router();

/**
 * @route  api/v1
 */

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/teachers", teachersRouter);
router.use("/modules", modulesRouter);
router.use("/schedule", scheduleRouter);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  console.log(req.user);

  res.status(200).json({
    success: true,
    message: "Server v1 is up and running",
  });
});

export default router;
