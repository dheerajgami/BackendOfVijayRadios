import express from "express";
import { upload } from "../config/cloudinary.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/product.controller.js";

const router = express.Router();

// Admin Middleware
const isAdmin = (req, res, next) => {
  if (req.user?.role === "admin") {
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
