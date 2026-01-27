import mongoose from "mongoose";

export const validateCreateOrder = (req, res, next) => {
  const {
    user_name,
    email,
    mobile,
    address,
    city,
    state,
    zip,
    // items,
    // subtotal,
    // shipping,
    // total,
  } = req.body;

  // Required fields
  if (
    !user_name ||
    !email ||
    !mobile ||
    !address ||
    !city ||
    !state ||
    !zip
  ) {
    return res.status(400).json({
      success: false,
      message: "All customer details are required",
    });
  }

  // Items validation
  // if (!Array.isArray(items) || items.length === 0) {
  //   return res.status(400).json({
  //     success: false,
  //     message: "Order items are required",
  //   });
  // }

  // Validate each item
  // for (const item of items) {
  //   if (
  //     !item.name ||
  //     typeof item.price !== "number" ||
  //     typeof item.qty !== "number"
  //   ) {
  //     return res.status(400).json({
  //       success: false,
  //       message: "Invalid order item format",
  //     });
  //   }
  // }

  // Amount validation
//   if (
//     typeof subtotal !== "number" ||
//     typeof shipping !== "number" ||
//     typeof total !== "number"
//   ) {
//     return res.status(400).json({
//       success: false,
//       message: "Invalid order amount values",
//     });
//   }

  next(); // ✅ Passed validation
};

export const validateOrderStatus = (req, res, next) => {
  const { status } = req.body;

  const allowedStatus = [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (!status || !allowedStatus.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid order status",
    });
  }

  next();
};


export const validateOrderId = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid order ID",
    });
  }

  next();
};
