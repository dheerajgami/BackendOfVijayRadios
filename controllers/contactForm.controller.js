import contactFormModel from "../model/contactForm.model.js";

/**
 * @desc    Create Contact Form
 * @route   POST /api/contact
 * @access  Public
 */
export const createContactForm = async (req, res) => {
  try {
    const { user_name, email, mobile, message } = req.body;

    // Check required fields
    if (!user_name || !email || !mobile || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check duplicate email or mobile
    const existingUser = await contactFormModel.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email or Mobile already exists",
      });
    }

    // Create new contact
    const contact = await contactFormModel.create({
      user_name,
      email,
      mobile,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Contact form submitted successfully",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
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
    const contacts = await contactFormModel.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
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

    const contact = await contactFormModel.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
