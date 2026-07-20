import express from "express";
import { getDashboardStats } from "../controllers/admin.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Custom isAdmin middleware inline (or we can move it to auth.middleware.js)
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ success: false, message: "Not authorized as an admin" });
  }
};

router.get("/dashboard-stats", protect, isAdmin, getDashboardStats);

export default router;
