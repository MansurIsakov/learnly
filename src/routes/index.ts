import { Router, Request, Response, NextFunction } from "express";

import authRouter from "./auth.route";
import usersRouter from "./users.route";
import teachersRouter from "./teachers.route";
import modulesRouter from "./modules.route";
import scheduleRouter from "./schedule.route";

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
