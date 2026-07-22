import * as orderService from "../services/order.service.js";
import { getIO } from "../socket.js";
import Notification from "../models/notification.model.js";

/* =====================================================
   CREATE ORDER (CHECKOUT)
   POST /api/order/create
   ===================================================== */
export const createOrder = async (req, res) => {
  try {
    const order = await orderService.createOrder(req.body);

    // --- Notification logic ---
    // 1. Notify Admin
    const adminNotification = await Notification.create({
      title: "New Order",
      message: `A new order has been placed for ${req.body.product_name || 'a product'}.`,
      type: "new_order",
      recipient: "admin",
      link: `/admin/orders/${order._id}` // optional
    });

    const io = getIO();
    io.to("admin").emit("admin_notification", adminNotification);

    // 2. Notify Customer
    if (order.userId) {
      const customerNotification = await Notification.create({
        title: "Order Placed",
        message: `Your order for ${req.body.product_name || 'a product'} has been placed successfully.`,
        type: "order_status",
        recipient: order.userId,
        link: `/orders/${order._id}` 
      });
      io.to(order.userId.toString()).emit("user_notification", customerNotification);
    }
    // -------------------------

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      message: error.status ? error.message : "Failed to place order",
    });
  }
};

/* =====================================================
   GET ALL ORDERS (ADMIN)
   GET /api/order/all
   ===================================================== */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Get All Orders Error:", error);
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      message: error.status ? error.message : "Failed to fetch orders",
    });
  }
};

/* =====================================================
   GET MY ORDERS (CUSTOMER)
   GET /api/order/my-orders/:userId
   ===================================================== */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await orderService.getMyOrders(req.params.userId);

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Get My Orders Error:", error);
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      message: error.status ? error.message : "Failed to fetch orders",
    });
  }
};

/* =====================================================
   GET SINGLE ORDER BY ID
   GET /api/order/:id
   ===================================================== */
export const getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get Order By ID Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const status = error.status || 500;
    res.status(status).json({
      success: false,
      message: error.status ? error.message : "Error fetching order",
    });
  }
};

/* =====================================================
   UPDATE ORDER STATUS (ADMIN)
   PATCH /api/order/:id/status
   ===================================================== */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(req.params.id, status);

    // --- Notification logic ---
    if (order.userId) {
      let title = "Order Updated";
      let message = `Your order status has been updated to: ${status}`;
      
      if (status === "Delivered") {
        title = "Order Delivered";
        message = `Your order has been delivered successfully. Thank you for shopping with us!`;
      } else if (status === "Dispatched" || status === "Shipped" || status === "Out for delivery") {
        title = "Order Tracked";
        message = `Your order is now ${status}.`;
      }

      const customerNotification = await Notification.create({
        title,
        message,
        type: "order_status",
        recipient: order.userId,
        link: `/orders/${order._id}` 
      });

      const io = getIO();
      io.to(order.userId.toString()).emit("user_notification", customerNotification);
    }
    // -------------------------

    res.status(200).json({
      success: true,
      message: "Order status updated",
      data: order,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      message: error.status ? error.message : "Failed to update order status",
    });
  }
};

/* =====================================================
   DELETE ORDER
   DELETE /api/order/:id
   ===================================================== */
export const deleteOrder = async (req, res) => {
  try {
    await orderService.deleteOrder(req.params.id);

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Delete Order Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const status = error.status || 500;
    res.status(status).json({
      success: false,
      message: error.status ? error.message : "Failed to delete order",
    });
  }
};
