import { Router } from "express";

const router: Router = Router();

import * as authController from "./auth.controller";
/**
 * @route   api/v1/auth
 */

// Sign Up
router.route("/signup").post(authController.signUp);

// Login
router.route("/login").post(authController.login);

// Forgot Password
router.route("/forgot-password").post((req, res) => {
  res.send("Forgot Password");
});

// Reset Password
router.route("/reset-password").put((req, res) => {
  res.send("Reset Password");
});

export default router;
