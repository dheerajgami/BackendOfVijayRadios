import contactFormModel from "../model/contactForm.model.js";

export const createContactForm = async (contactData) => {
  const { user_name, email, mobile, message } = contactData;

  // Check required fields
  if (!user_name || !email || !mobile || !message) {
    const error = new Error("All fields are required");
    error.status = 400;
    throw error;
  }

  // Check duplicate email or mobile
  const existingUser = await contactFormModel.findOne({
    $or: [{ email }, { mobile }],
  });

  if (existingUser) {
    const error = new Error("Email or Mobile already exists");
    error.status = 409;
    throw error;
  }

  // Create new contact
  const contact = await contactFormModel.create({
    user_name,
    email,
    mobile,
    message,
  });

  return contact;
};

export const getAllContactForms = async () => {
  return await contactFormModel.find().sort({ createdAt: -1 });
};

export const deleteContactForm = async (id) => {
  const contact = await contactFormModel.findByIdAndDelete(id);

  if (!contact) {
    const error = new Error("Contact not found");
    error.status = 404;
    throw error;
  }

  return contact;
};
