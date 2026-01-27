import express from "express";
import {
  createContactForm,
  getAllContactForms,
  deleteContactForm,
} from "../controllers/contactForm.controller.js";

import {
  validateContactForm,
  checkDuplicateContact,
  protectContact,
} from "../middleware/contactForm.middleware.js";

import { contactFormValidator } from "../validations/contactForm.validate.js";

const router = express.Router();

router.post("/contact", createContactForm);
router.get("/contact", getAllContactForms);
router.delete("/contact/:id", deleteContactForm);

router.post(
  "/contact",
  contactFormValidator,
  validateContactForm,
  checkDuplicateContact,
  createContactForm
);

router.get("/contact", protectContact, getAllContactForms);
router.delete("/contact/:id", protectContact, deleteContactForm);



export default router;
