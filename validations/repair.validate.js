import { body } from "express-validator";

export const createRepairValidator = [
  body("user_name")
    .trim()
    .notEmpty()
    .withMessage("User Name is required")
    .isLength({ min: 2, max: 32 })
    .withMessage("User Name must be 2-32 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("mobile")
    .notEmpty()
    .withMessage("Mobile number is required")
    .matches(/^(\+91[\-\s]?)?[0]?(91)?[6-9]\d{9}$/)
    .withMessage("Invalid Indian Mobile Number"),

  body("product_type")
    .trim()
    .notEmpty()
    .withMessage("Product type is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Product type must be 2-50 characters"),

  body("describation")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Description must not exceed 300 characters"),
];
