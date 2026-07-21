import * as contactFormService from "../services/contactForm.service.js";

/**
 * @desc    Create Contact Form
 * @route   POST /api/contact
 * @access  Public
 */
export const createContactForm = async (req, res) => {
  try {
    const contact = await contactFormService.createContactForm(req.body);

    res.status(201).json({
      success: true,
      message: "Contact form submitted successfully",
      data: contact,
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      message: error.status ? error.message : "Server Error",
      error: error.status ? null : error.message,
    });
  }
};

/**
 * @desc    Get All Contact Forms
 * @route   GET /api/contact
 * @access  Admin
 */
export const getAllContactForms = async (req, res) => {
  try {
    const contacts = await contactFormService.getAllContactForms();

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      message: error.status ? error.message : "Server Error",
      error: error.status ? null : error.message,
    });
  }
};

/**
 * @desc    Delete Contact Form
 * @route   DELETE /api/contact/:id
 * @access  Admin
 */
export const deleteContactForm = async (req, res) => {
  try {
    const { id } = req.params;
    await contactFormService.deleteContactForm(id);

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      message: error.status ? error.message : "Server Error",
      error: error.status ? null : error.message,
    });
  }
};
