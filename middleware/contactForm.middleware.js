import contactFormModel from "../model/contactForm.model.js";
import jwt from "jsonwebtoken";

/**
 * ✅ Validate Contact Form Fields
 */
export const validateContactForm = (req, res, next) => {
  const { user_name, email, mobile, message } = req.body;

  // ❌ Required fields check
  if (!user_name || !email || !mobile || !message) {
    return res.status(400).json({
      success: false,
      message: "User name, email, mobile and message are required",
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

  // ❌ Mobile format check (India)
  const mobileRegex =
    /^(\+91[\-\s]?)?[0]?(91)?[6-9]\d{9}$/;

  if (!mobileRegex.test(mobile)) {
    return res.status(400).json({
      success: false,
      message: "Invalid mobile number",
    });
  }

  // ❌ Message length check
  if (message.length < 2 || message.length > 100) {
    return res.status(400).json({
      success: false,
      message: "Message must be between 2 and 100 characters",
    });
  }

  next(); // ✅ Validation passed
};



/**
 * ✅ Check Duplicate Contact (Email or Mobile)
 */
export const checkDuplicateContact = async (req, res, next) => {
  try {
    const { email, mobile } = req.body;

    const exists = await contactFormModel.findOne({
      $or: [{ email }, { mobile }],
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Contact already exists with this email or mobile",
      });
    }

    next();
  } catch (error) {
    console.error("Duplicate Contact Check Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during duplicate check",
    });
  }
};



/**
 * 🔐 Protect Contact Routes (Admin)
 */
export const protectContact = (req, res, next) => {
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
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
