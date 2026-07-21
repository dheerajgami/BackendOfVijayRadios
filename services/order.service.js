import orderModel from "../model/order.model.js";

export const createOrder = async (orderData) => {
  const {
    user_name,
    email,
    mobile,
    address,
    city,
    state,
    zip,
    items,
    payment,
    subtotal,
    shipping,
    total,
  } = orderData;

  if (
    !user_name ||
    !email ||
    !mobile ||
    !address ||
    !city ||
    !state ||
    !zip ||
    !items ||
    items.length === 0
  ) {
    const error = new Error("All required checkout fields must be provided");
    error.status = 400;
    throw error;
  }

  const order = await orderModel.create({
    user_name,
    email,
    mobile,
    address,
    city,
    state,
    zip,
    items,
    payment,
    subtotal,
    shipping,
    total,
  });

  return order;
};

export const getAllOrders = async () => {
  return await orderModel
    .find()
    .populate("items.productId", "images name")
    .sort({ createdAt: -1 });
};

export const getOrderById = async (id) => {
  const order = await orderModel.findById(id);

  if (!order) {
    const error = new Error("Order not found");
    error.status = 404;
    throw error;
  }

  return order;
};

export const updateOrderStatus = async (id, status) => {
  const order = await orderModel.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!order) {
    const error = new Error("Order not found");
    error.status = 404;
    throw error;
  }

  return order;
};

export const deleteOrder = async (id) => {
  const order = await orderModel.findByIdAndDelete(id);

  if (!order) {
    const error = new Error("Order not found");
    error.status = 404;
    throw error;
  }

  return order;
};
