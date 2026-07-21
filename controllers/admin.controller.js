import * as adminService from "../services/admin.service.js";
import ServerResponse from "../response/pattern.js";

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard-stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.status(200).json(new ServerResponse(true, stats, "Stats fetched successfully", null));
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    const status = error.status || 500;
    res.status(status).json(new ServerResponse(false, null, error.status ? error.message : "Server error fetching stats", error.status ? null : error));
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();
    res.status(200).json(new ServerResponse(true, users, "Users fetched successfully", null));
  } catch (error) {
    console.error("Get All Users Error:", error);
    const status = error.status || 500;
    res.status(status).json(new ServerResponse(false, null, error.status ? error.message : "Server error fetching users", error.status ? null : error));
  }
};

// @desc    Update user status
// @route   PATCH /api/admin/users/:id/status
// @access  Private/Admin
export const updateUserStatus = async (req, res) => {
  try {
    const { isActive, isDeleted } = req.body;
    const updatedUser = await adminService.updateUserStatus(req.user.id, req.params.id, isActive, isDeleted);
    res.status(200).json(new ServerResponse(true, updatedUser, "User status updated", null));
  } catch (error) {
    console.error("Update User Status Error:", error);
    const status = error.status || 500;
    res.status(status).json(new ServerResponse(false, null, error.status ? error.message : "Server error updating user", error.status ? null : error));
  }
};
