import express from 'express';
import { getUser, updateUser, deleteUser, searchUsers, changePassword, uploadPhoto, removePhoto } from '../controllers/user.controller.js';
import { upload } from "../config/cloudinary.js";
import { protect } from '../middleware/auth.middleware.js';
import { updateUserValidator } from '../validations/user.validate.js';
import { validate } from '../middleware/validatorErrorHandler.js';

const router = express.Router();

router.use("/", protect)
  .delete("/", deleteUser)
  .get("/me", getUser);

router.patch("/", updateUserValidator, validate, updateUser);

router.get("/search", searchUsers);

router.put("/change-password", protect, changePassword);
router.post("/photo", protect, upload.single("photo"), uploadPhoto);
router.delete("/photo", protect, removePhoto); export default router;

