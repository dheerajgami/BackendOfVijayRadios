import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    /* ================= CUSTOMER DETAILS ================= */
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false, // Make it optional for guest checkouts if any
    },
    user_name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name must be at most 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email format",
      ],
    },

    mobile: {
      type: String,
      required: [true, "Phone number is required"],
      match: [
        /^(\+91[-\s]?)?0?(91)?[6-9]\d{9}$/,
        "Invalid Indian mobile number",
      ],
    },

    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
      minlength: [5, "Address must be at least 5 characters"],
    },

    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },

    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },

    zip: {
      type: String,
      required: [true, "ZIP code is required"],
      trim: true,
    },

    /* ================= ORDER ITEMS ================= */
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        qty: {
          type: Number,
          required: true,
          min: 1,
        },
        image: {
          type: String,
        },
      },
    ],

    /* ================= PAYMENT & TOTAL ================= */
    payment: {
      type: String,
      enum: ["cod", "card", "upi"],
      default: "cod",
    },

    subtotal: {
      type: Number,
      required: true,
    },

    shipping: {
      type: Number,
      required: true,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
    },

    /* ================= ORDER STATUS ================= */
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const orderModel = model("order", orderSchema);

export default orderModel;
