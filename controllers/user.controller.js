import * as userService from "../services/user.service.js";
import ServerResponse from "../response/pattern.js";
import { getIO } from "../socket.js";
import Notification from "../models/notification.model.js";

/**
 * ======================
 * LOGIN USER
 * ======================
 */
export async function loginUser(req, res) {
  try {
    const { login_user, password } = req.body;

    if (!login_user || !password) {
      return res
        .status(400)
        .json(new ServerResponse(false, null, "All fields are required", null));
    }

    const { token, userData } = await userService.loginUser(login_user, password);

    // set httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: userData,
    });
  } catch (error) {
    const status = error.status || 500;
    return res
      .status(status)
      .json(new ServerResponse(false, null, error.message, error.status ? null : error));
  }
}

/**
 * ======================
 * GET LOGGED-IN USER
 * ======================
 */
export async function getUser(req, res) {
  try {
    const user = await userService.getUserById(req.user.id);
    return res
      .status(200)
      .json(new ServerResponse(true, user, "Successfully fetch user", null));
  } catch (error) {
    const status = error.status || 500;
    return res
      .status(status)
      .json(new ServerResponse(false, null, error.message, error.status ? null : error));
  }
}

/**
 * ======================
 * REGISTER USER
 * ======================
 */
export async function addUser(req, res) {
  try {
    const user = await userService.addUser(req.body);

    // --- Notification logic ---
    try {
      const adminNotification = await Notification.create({
        title: "New User Registered",
        message: `${user.user_name || req.body.user_name} (${user.email || req.body.email}) has just registered.`,
        type: "new_user",
        recipient: "admin",
        link: `/admin/users` 
      });
      
      const io = getIO();
      io.to("admin").emit("admin_notification", adminNotification);
    } catch(err) {
      console.error("Socket error on register", err);
    }
    // -------------------------

    return res.status(201).json(
      new ServerResponse(true, user, "User Registered Successfully", null)
    );
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json(new ServerResponse(false, null, messages.join(", "), error));
    }
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json(new ServerResponse(false, null, `${field} already exists. Please login.`, error));
    }
    const status = error.status || 500;
    return res
      .status(status)
      .json(new ServerResponse(false, null, error.status ? error.message : "Internal server error: " + error.message, error.status ? null : error));
  }
}

/**
 * ======================
 * UPDATE USER
 * ======================
 */
export async function updateUser(req, res) {
  try {
    const user = await userService.updateUser(req.user.id, req.body);
    return res
      .status(200)
      .json(new ServerResponse(true, user, "Your Detail is Updated", null));
  } catch (error) {
    const status = error.status || 500;
    return res
      .status(status)
      .json(new ServerResponse(false, null, error.message, error.status ? null : error));
  }
}

/**
 * ======================
 * DELETE USER (SOFT)
 * ======================
 */
export async function deleteUser(req, res) {
  try {
    const user = await userService.deleteUser(req.user.id);
    return res
      .status(200)
      .json(new ServerResponse(true, user, "Your Account is Deleted", null));
  } catch (error) {
    const status = error.status || 500;
    return res
      .status(status)
      .json(new ServerResponse(false, null, error.message, error.status ? null : error));
  }
}

/**
 * ======================
 * SEARCH USERS
 * ======================
 */
export async function searchUsers(req, res) {
  try {
    const users = await userService.searchUsers(req.query.q);
    return res
      .status(200)
      .json(new ServerResponse(true, users, { count: users.length }, null));
  } catch (error) {
    const status = error.status || 500;
    return res
      .status(status)
      .json(new ServerResponse(false, null, error.message, error.status ? null : error));
  }
}

/**
 * ======================
 * CHANGE PASSWORD
 * ======================
 */
export async function changePassword(req, res) {
  try {
    await userService.changePassword(req.user.id, req.body.oldPassword, req.body.newPassword);
    return res.status(200).json(new ServerResponse(true, null, "Password changed successfully", null));
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json(new ServerResponse(false, null, error.message, error.status ? null : error));
  }
}

/**
 * ======================
 * UPLOAD PROFILE PHOTO
 * ======================
 */
export async function uploadPhoto(req, res) {
  try {
    const updatedUser = await userService.uploadPhoto(req.user.id, req.file);
    return res.status(200).json(new ServerResponse(true, updatedUser, "Profile photo updated", null));
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json(new ServerResponse(false, null, error.message, error.status ? null : error));
  }
}

/**
 * ======================
 * REMOVE PROFILE PHOTO
 * ======================
 */
export async function removePhoto(req, res) {
  try {
    const updatedUser = await userService.removePhoto(req.user.id);
    return res.status(200).json(new ServerResponse(true, updatedUser, "Profile photo removed", null));
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json(new ServerResponse(false, null, error.message, error.status ? null : error));
  }
}
