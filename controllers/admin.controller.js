import Order from "../model/order.model.js";
import User from "../model/user.model.js";
import Product from "../model/product.model.js";
import ServerResponse from "../response/pattern.js";

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard-stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
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
    // In a real robust system, we would fill in gaps (empty months/days).
    // For simplicity, we process what we have.
    
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

    res.status(200).json(
      new ServerResponse(true, {
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
      }, "Stats fetched successfully", null)
    );
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json(new ServerResponse(false, null, "Server error fetching stats", null));
  }
};
