import { Router } from "express";
import * as authController from "../controller/auth.controller";
import * as modulesController from "../controller/modules.controller";

const router: Router = Router();

/**
 * @route   api/v1/modules
 */

// Modules
router
  .route("/")
  .post(modulesController.createModule)
  .get(modulesController.getAllModules);

// Module
router
  .route("/:id")
  .get(authController.protect, modulesController.getModule)
  .delete(authController.protect, modulesController.deleteModule)
  .put(modulesController.updateModule);

export default router;
