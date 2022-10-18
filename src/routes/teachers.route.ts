import { Router, Request, Response } from "express";

const router: Router = Router();

/**
 * @route   api/v1/teachers
 */

// Get all modules
router.route("/").get((req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Get all teachers info",
  });
});

export default router;
