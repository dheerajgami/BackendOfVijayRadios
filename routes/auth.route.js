import express from "express";
import {
  loginUser,
  addUser,
  getUser,
  updateUser,
  deleteUser,
  searchUsers,
} from "../controllers/user.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", addUser);

router.get("/profile", protect, getUser);
router.put("/update", protect, updateUser);
router.delete("/delete", protect, deleteUser);
router.get("/search", protect, searchUsers);

export default router;
