import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["new_order", "new_user", "order_status", "general"],
      default: "general",
    },
    recipient: {
      type: mongoose.Schema.Types.Mixed, 
      // can be "admin" (String) or ObjectId (Reference to User)
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String, // optional link to redirect when clicked
    }
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
