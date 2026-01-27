import orderModel from "../model/order.model.js";

/* =====================================================
   CREATE ORDER (CHECKOUT)
   POST /api/order/create
   ===================================================== */
export const createOrder = async (req, res) => {
  try {
    const {
      user_name,
      email,
      mobile,
      address,
      city,
      state,
      zip,
      // items,
      // payment,
      // subtotal,
      // shipping,
      // total,
    } = req.body;

    // Basic safety check
    if (
      !user_name ||
      !email ||
      !mobile ||
      !address ||
      !city ||
      !state ||
       !zip 
      // || !items ||
      // items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "All required checkout fields must be provided",
      });
    }

    const order = await orderModel.create({
      user_name,
      email,
      mobile,
      address,
      city,
      state,
      zip,
      // items,
      // payment,
      // subtotal,
      // shipping,
      // total,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    console.error("Create Order Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to place order",
    });
  }
};

/* =====================================================
   GET ALL ORDERS (ADMIN)
   GET /api/order/all
   ===================================================== */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Get All Orders Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

/* =====================================================
   GET SINGLE ORDER BY ID
   GET /api/order/:id
   ===================================================== */
export const getOrderById = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

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

    res.status(500).json({
      success: false,
      message: "Error fetching order",
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

    const order = await orderModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated",
      data: order,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};

/* =====================================================
   DELETE ORDER
   DELETE /api/order/:id
   ===================================================== */
export const deleteOrder = async (req, res) => {
  try {
    const order = await orderModel.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

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

    res.status(500).json({
      success: false,
      message: "Failed to delete order",
    });
  }
};
