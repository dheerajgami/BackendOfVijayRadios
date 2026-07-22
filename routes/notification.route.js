import express from "express";
import { getNotifications, markAsRead, markAllAsRead } from "../controllers/notification.controller.js";
import { protect } from "../middleware/auth.middleware.js"; 

const router = express.Router();

router.get("/:recipient", protect, getNotifications);
router.put("/:id/read", protect, markAsRead);
router.put("/:recipient/read-all", protect, markAllAsRead);

export default router;
