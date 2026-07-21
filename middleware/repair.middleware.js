import repairModel from "../model/repair.model.js";
import jwt from "jsonwebtoken";

export const validateRepair = (req, res, next) => {
  const { user_name, email, mobile, product_type } = req.body;

  // ❌ Required fields check
  if (!user_name || !email || !mobile || !product_type) {
    return res.status(400).json({
      success: false,
      message: "User name, email, mobile and product type are required",
    });
  }

  // ❌ Name length check
  if (user_name.length < 2 || user_name.length > 32) {
    return res.status(400).json({
      success: false,
      message: "User name must be between 2 and 32 characters",
    });
  }

  // ❌ Email format check
  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }

  // ❌ Mobile format (India)
  const mobileRegex =
    /^(\+91[-\s]?)?0?(91)?[6-9]\d{9}$/;

  if (!mobileRegex.test(mobile)) {
    return res.status(400).json({
      success: false,
      message: "Invalid mobile number",
    });
  }

  next(); // ✅ Everything ok
};



export const checkDuplicateRepair = async (req, res, next) => {
  try {
    const { email, mobile } = req.body;

    const exists = await repairModel.findOne({
      $or: [{ email }, { mobile }],
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Repair request already exists with this email or mobile",
      });
    }

    next();
  } catch (error) {
    console.error("Duplicate Repair Check Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during duplicate check",
    });
  }
};



export const protectRepair = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Login required",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
