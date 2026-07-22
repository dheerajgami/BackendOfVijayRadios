import express from "express";
import {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/order.controller.js";

import {
  validateCreateOrder,
  validateOrderStatus,
  validateOrderId,
} from "../middleware/order.middleware.js";
import { createOrderValidator } from "../validations/order.validate.js";

const router = express.Router();

router.post("/create",createOrderValidator, validateCreateOrder, createOrder);
router.get("/all", getAllOrders);
router.get("/my-orders/:userId", getMyOrders);
router.get("/:id", validateOrderId, getOrderById);
router.patch("/:id/status", validateOrderId, validateOrderStatus, updateOrderStatus);
router.delete("/:id", validateOrderId, deleteOrder);

export default router;
