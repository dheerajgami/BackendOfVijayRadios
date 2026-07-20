import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { protect } from "../middleware/auth.middleware.js";
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from "../controllers/product.controller.js";

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = "public/uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Images only!");
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Admin Middleware
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ success: false, message: "Not authorized as an admin" });
  }
};

router.route("/")
  .get(getProducts)
  .post(protect, isAdmin, upload.array("images", 10), createProduct); // Max 10 images

router.route("/:id")
  .get(getProductById)
  .put(protect, isAdmin, upload.array("images", 10), updateProduct)
  .delete(protect, isAdmin, deleteProduct);

export default router;
