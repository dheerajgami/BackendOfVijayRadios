import { body } from "express-validator";

export const createOrderValidator = [
  body("user_name")
    .trim()
    .notEmpty()
    .withMessage("Full Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Full Name must be 2-50 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("mobile")
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^(\+91[\-\s]?)?[0]?(91)?[6-9]\d{9}$/)
    .withMessage("Invalid Indian Mobile Number"),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ min: 5, max: 200 })
    .withMessage("Address must be 5-200 characters"),

  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required"),

  body("state")
    .trim()
    .notEmpty()
    .withMessage("State is required"),

  body("zip")
    .trim()
    .notEmpty()
    .withMessage("ZIP code is required")
    .isLength({ min: 4, max: 10 })
    .withMessage("ZIP code must be 4-10 characters"),

  // body("items")
  //   .isArray({ min: 1 })
  //   .withMessage("Order items are required"),

  // body("items.*.name")
  //   .trim()
  //   .notEmpty()
  //   .withMessage("Product name is required"),

  // body("items.*.price")
  //   .isNumeric()
  //   .withMessage("Product price must be a number"),

  // body("items.*.qty")
  //   .isInt({ min: 1 })
  //   .withMessage("Product quantity must be at least 1"),

  // body("payment")
  //   .optional()
  //   .isIn(["cod", "card", "upi"])
  //   .withMessage("Invalid payment method"),

  // body("subtotal")
  //   .isNumeric()
  //   .withMessage("Subtotal must be a number"),

  // body("shipping")
  //   .isNumeric()
  //   .withMessage("Shipping must be a number"),

  // body("total")
  //   .isNumeric()
  //   .withMessage("Total amount must be a number"),
];
