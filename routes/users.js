import express from 'express';
import { getUser, updateUser, deleteUser, searchUsers, changePassword, uploadPhoto, removePhoto } from '../controllers/user.controller.js';
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { protect } from '../middleware/auth.middleware.js';
import { updateUserValidator } from '../validations/user.validate.js';
import { validate } from '../middleware/validatorErrorHandler.js';

const router = express.Router();

const uploadDir = "public/uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename(req, file, cb) {
    cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpg|jpeg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb("Images only!");
    }
  },
});

router.use("/", protect)
  .delete("/", deleteUser)
  .get("/me", getUser);

router.patch("/", updateUserValidator, validate, updateUser);

router.get("/search", searchUsers);

router.put("/change-password", protect, changePassword);
router.post("/photo", protect, upload.single("photo"), uploadPhoto);
router.delete("/photo", protect, removePhoto); export default router;

