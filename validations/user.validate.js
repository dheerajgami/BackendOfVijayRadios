import { body } from "express-validator";

export const registerUserValidator = [
  body("user_name")
    .trim()
    .notEmpty()
    .withMessage("User Name is reqiured")
    .isLength({ min: 2, max: 32 })
    .withMessage("User Name must be 2-32 character"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("mobile")
    .notEmpty()
    .withMessage("Mobile number is required")
    .matches(/^(\+91[-\s]?)?0?(91)?[6-9]\d{9}$/)
    .withMessage("Invalid Indian Mobile Number"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 character"),

  body("address")
    .optional()
    .trim()
    .isLength({ min: 3, max: 32 })
    .withMessage("Address must be 3-32 character"),

  body("gender")
    .optional()
    .isIn(["male", "female", "other"])
    .withMessage("Invalid gender"),

  body("role")
    .optional()
    .isIn(["customer", "admin"])
    .withMessage("Invalid role"),
];

export const updateUserValidator = [
  body("user_name")
    .trim()
    .notEmpty()
    .withMessage("User name is required")
    .isLength({ min: 2, max: 32 })
    .withMessage("User name is must be 2-32 character"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("address")
    .optional()
    .trim()
    .isLength({ min: 3, max: 32 })
    .withMessage("Address must be 3-32 characters"),

  body("gender")
    .optional()
    .isIn(["male", "female", "other"])
    .withMessage("Invalid gender"),
];
