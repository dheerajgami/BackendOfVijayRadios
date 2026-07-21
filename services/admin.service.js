import Order from "../model/order.model.js";
import User from "../model/user.model.js";
import Product from "../model/product.model.js";

export const getDashboardStats = async () => {
  // 1. Total KPI Stats
  const totalUsers = await User.countDocuments();
  const totalOrders = await Order.countDocuments();
  
  // Total Revenue (sum of all non-cancelled order totals)
  const revenueAggr = await Order.aggregate([
    { $match: { status: { $ne: "cancelled" } } },
    { $group: { _id: null, totalRevenue: { $sum: "$total" } } }
  ]);
  const totalRevenue = revenueAggr[0]?.totalRevenue || 0;

  // Active Products count (Real count from database)
  const activeProducts = await Product.countDocuments({ status: "active" });

  // 2. Order Status Distribution (for Pie Chart)
  const orderStatusAggr = await Order.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);
  
  // Map colors for pie chart
  const statusColors = {
    pending: "#f59e0b",
    confirmed: "#3b82f6",
    shipped: "#8b5cf6",
    delivered: "#10b981",
    cancelled: "#ef4444"
  };
  
  const orderStatusData = orderStatusAggr.map(item => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    value: item.count,
    color: statusColors[item._id] || "#gray"
  }));

  // 3. Revenue over Time (Monthly & Yearly)
  const revenueOverTime = await Order.aggregate([
    { $match: { status: { $ne: "cancelled" } } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
          week: { $isoWeek: "$createdAt" }
        },
        revenue: { $sum: "$total" },
        orders: { $sum: 1 },
        productsSold: { $sum: { $size: { $ifNull: ["$items", []] } } }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
  ]);

  // Format data for Recharts (Frontend)
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  let revenueMonthly = {};
  let revenueYearly = {};
  let ordersDaily = {};
  let ordersWeekly = {};
  let ordersMonthly = {};
  let ordersYearly = {};
  let productsWeekly = {};
  let productsMonthly = {};
  let productsYearly = {};

  revenueOverTime.forEach(data => {
    const year = data._id.year;
    const month = monthNames[data._id.month - 1];
    const week = `W${data._id.week}`;
    const day = `${month} ${data._id.day}`;

    // Revenue
    revenueMonthly[month] = (revenueMonthly[month] || 0) + data.revenue;
    revenueYearly[year] = (revenueYearly[year] || 0) + data.revenue;

    // Orders
    ordersDaily[day] = (ordersDaily[day] || 0) + data.orders;
    ordersWeekly[week] = (ordersWeekly[week] || 0) + data.orders;
    ordersMonthly[month] = (ordersMonthly[month] || 0) + data.orders;
    ordersYearly[year] = (ordersYearly[year] || 0) + data.orders;

    // Products
    productsWeekly[week] = (productsWeekly[week] || 0) + data.productsSold;
    productsMonthly[month] = (productsMonthly[month] || 0) + data.productsSold;
    productsYearly[year] = (productsYearly[year] || 0) + data.productsSold;
  });

  // Helper to format object to array
  const toArray = (obj, keyName, valName) => Object.keys(obj).map(k => ({ name: k, [valName]: obj[k] }));

  return {
    kpi: {
      totalRevenue,
      totalOrders,
      activeProducts,
      totalUsers
    },
    orderStatusData,
    revenueData: {
      monthly: toArray(revenueMonthly, "name", "revenue"),
      yearly: toArray(revenueYearly, "name", "revenue")
    },
    orderData: {
      daily: toArray(ordersDaily, "name", "orders"),
      weekly: toArray(ordersWeekly, "name", "orders"),
      monthly: toArray(ordersMonthly, "name", "orders"),
      yearly: toArray(ordersYearly, "name", "orders")
    },
    productData: {
      weekly: toArray(productsWeekly, "name", "sales"),
      monthly: toArray(productsMonthly, "name", "sales"),
      yearly: toArray(productsYearly, "name", "sales")
    }
  };
};

export const getAllUsers = async () => {
  return await User.find().select("-password -__v").sort({ createdAt: -1 });
};

export const updateUserStatus = async (loggedInUserId, targetUserId, isActive, isDeleted) => {
  // Prevent updating oneself to avoid locking out the only admin
  if (loggedInUserId === targetUserId) {
    const error = new Error("You cannot change your own status");
    error.status = 400;
    throw error;
  }

  const user = await User.findById(targetUserId);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  if (isActive !== undefined) user.isActive = isActive;
  if (isDeleted !== undefined) user.isDeleted = isDeleted;

  await user.save();
  
  // Return updated user without password
  const updatedUser = user.toObject();
  delete updatedUser.password;
  delete updatedUser.__v;

  return updatedUser;
};
