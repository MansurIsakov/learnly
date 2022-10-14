import { Router, Request, Response } from "express";

const router: Router = Router();

import * as usersController from "../controllers/users.controller";
import isAuth from "../middlewares/isAuth";

/**
 * @route   api/v1/users
 */

router.use(isAuth);

// Get all users
router.route("/users").get(usersController.getAllUsers);

export default router;
