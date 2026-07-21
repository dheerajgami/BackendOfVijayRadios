import express from "express";
import { getDashboardStats, getAllUsers, updateUserStatus } from "../controllers/admin.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Custom isAdmin middleware inline (or we can move it to auth.middleware.js)
const isAdmin = (req, res, next) => {
  if (req.user?.role === "admin") {
    next();
  } else {
    res.status(403).json({ success: false, message: "Not authorized as an admin" });
  }
};

router.get("/dashboard-stats", protect, isAdmin, getDashboardStats);
router.get("/users", protect, isAdmin, getAllUsers);
router.patch("/users/:id/status", protect, isAdmin, updateUserStatus);

export default router;
