import User from "../model/user.model.js";
import { generateToken } from "../config/jwt.config.js";
import bcrypt from "bcrypt";


export const loginUser = async (login_user, password) => {
  let user = await User.findOne({
    $or: [{ email: login_user }, { mobile: String(login_user) }],
  });

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  if (!user.isActive || user.isDeleted) {
    const error = new Error("Unauthorized or Deleted Account. Contact Admin.");
    error.status = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    const error = new Error("Invalid password");
    error.status = 401;
    throw error;
  }

  let userData = user.toObject();
  delete userData.password;
  delete userData.__v;

  const token = generateToken({
    id: userData._id,
    email: userData.email,
    role: userData.role,
  });

  userData.token = token;

  return { token, userData };
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId).select("-password -__v");
  if (!user) {
    const error = new Error("User Not Found");
    error.status = 404;
    throw error;
  }
  return user;
};

export const addUser = async (userData) => {
  const { user_name, email, mobile, password, confirmPassword, role } = userData;

  if (password !== confirmPassword) {
    const error = new Error("Passwords do not match");
    error.status = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    user_name,
    email,
    mobile,
    password: hashedPassword,
    role: role || "customer",
  });

  return user;
};

export const updateUser = async (userId, updateData) => {
  const user = await User.findByIdAndUpdate(
    userId,
    updateData,
    { new: true }
  );

  if (!user) {
    const error = new Error("User Not Found");
    error.status = 404;
    throw error;
  }

  return user;
};

export const deleteUser = async (userId) => {
  const user = await User.findOneAndUpdate(
    { _id: userId, isDeleted: false, isActive: true },
    { isDeleted: true, isActive: false },
    { new: true }
  );

  if (!user) {
    const error = new Error("Your Account not found");
    error.status = 404;
    throw error;
  }

  return user;
};

export const searchUsers = async (query) => {
  if (!query || query.trim() === "") {
    const error = new Error("Search query is required");
    error.status = 400;
    throw error;
  }

  const regex = new RegExp(query, "i");

  const users = await User.find({
    isDeleted: false,
    $or: [
      { user_name: { $regex: regex } },
      { email: { $regex: regex } },
    ],
  })
    .select("user_name email mobile")
    .limit(20);

  return users;
};

export const changePassword = async (userId, oldPassword, newPassword) => {
  if (!oldPassword || !newPassword) {
    const error = new Error("Old and new password required");
    error.status = 400;
    throw error;
  }

  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordValid) {
    const error = new Error("Incorrect old password");
    error.status = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  return true;
};

export const uploadPhoto = async (userId, file) => {
  if (!file) {
    const error = new Error("No image uploaded");
    error.status = 400;
    throw error;
  }

  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  // Cloudinary URL is in file.path
  const photoUrl = file.path;
  user.photo = photoUrl;
  await user.save();

  const updatedUser = user.toObject();
  delete updatedUser.password;

  return updatedUser;
};

export const removePhoto = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  if (user.photo) {
    // We skip deleting from Cloudinary for now, just set photo to null in DB
    user.photo = null;
    await user.save();
  }

  const updatedUser = user.toObject();
  delete updatedUser.password;

  return updatedUser;
};
