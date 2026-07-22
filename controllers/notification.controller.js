import Notification from "../model/notification.model.js";

// Fetch notifications for a specific recipient (admin or a user)
export const getNotifications = async (req, res) => {
  try {
    const { recipient } = req.params; // 'admin' or user id
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ recipient })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments({ recipient });
    const unreadCount = await Notification.countDocuments({ recipient, isRead: false });

    res.status(200).json({
      success: true,
      data: notifications,
      unreadCount,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Mark a single notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Mark all notifications as read for a recipient
export const markAllAsRead = async (req, res) => {
  try {
    const { recipient } = req.params; // 'admin' or user id
    await Notification.updateMany({ recipient, isRead: false }, { isRead: true });

    res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
