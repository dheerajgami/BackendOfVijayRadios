import express from "express";
import {
  createRepair,
  getAllRepairs,
  getRepairById,
  deleteRepair,
  updateRepairStatus,
} from "../controllers/repair.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  validateRepair,
  checkDuplicateRepair,
} from "../middleware/repair.middleware.js";
import { createRepairValidator } from "../validations/repair.validate.js";

const router = express.Router();

// Custom admin middleware (optional, if you want strictly admin for these routes)
const isAdmin = (req, res, next) => {
  if (req.user?.role === "admin") {
    next();
  } else {
    res.status(403).json({ success: false, message: "Not authorized as admin" });
  }
};

// Public or logged-in user can create a repair request
router.post(
  "/create",
  createRepairValidator,
  validateRepair,
  checkDuplicateRepair,
  createRepair
);

// Admin only routes
router.get("/all", protect, isAdmin, getAllRepairs);
router.get("/:id", protect, isAdmin, getRepairById);
router.delete("/:id", protect, isAdmin, deleteRepair);
router.patch("/:id/status", protect, isAdmin, updateRepairStatus);

export default router;
