import { Router, Request, Response } from "express";
import isAuth from "../middlewares/isAuth";

const router: Router = Router();

import * as authController from "../controllers/auth.controller";

/**
 * @route   api/v1/auth
 */

// Login w/ GitHub
router.route("/auth/github").get(authController.githubLogin);

router.route("/auth/github/callback").get(authController.githubAuth);

// Logout
router.route("/auth/logout").get(authController.logout);

export default router;
