import express from "express";
import {
  createRepair,
  getAllRepairs,
  getRepairById,
  deleteRepair,
} from "../controllers/repair.controller.js";

import {
  validateRepair,
  checkDuplicateRepair,
  protectRepair,
} from "../middleware/repair.middleware.js";
import { createRepairValidator } from "../validations/repair.validate.js";

const router = express.Router();

// Create repair (Protected + Validated)
router.post(
  "/create",
  createRepairValidator,
  protectRepair, // optional
  validateRepair,
  checkDuplicateRepair,
  createRepair
);

// Admin / dashboard
router.get("/all", getAllRepairs);
router.get("/:id", getRepairById);
router.delete("/:id", deleteRepair);

export default router;
