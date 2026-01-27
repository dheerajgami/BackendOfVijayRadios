import { body, validationResult } from "express-validator";

export const contactFormValidator = [
  body("user_name")
    .trim()
    .notEmpty()
    .withMessage("User Name is required")
    .isLength({ min: 2, max: 32 })
    .withMessage("User Name must be 2–32 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid Email address"),

  body("mobile")
    .trim()
    .notEmpty()
    .withMessage("Mobile number is required")
    .matches(/^(\+91[\-\s]?)?[0]?(91)?[6-9]\d{9}$/)
    .withMessage("Invalid Indian mobile number"),

  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Message must be 2–100 characters"),

  // Final validation handler
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        errors: errors.array(),
      });
    }

    next();
  },
];
