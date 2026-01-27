import User from "../model/user.model.js";
import { generateToken } from "../config/jwt.config.js";
import ServerResponse from "../response/pattern.js";
import bcrypt from "bcrypt";

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

    // find user by email or mobile
    let user = await User.findOne({
      $or: [{ email: login_user }, { mobile: String(login_user) }],
    });

    if (!user) {
      return res
        .status(404)
        .json(new ServerResponse(false, null, "User not found", null));
    }

    // account status check
    if (!user.isActive || user.isDeleted) {
      return res.status(401).json(
        new ServerResponse(
          false,
          null,
          "Unauthorized or Deleted Account. Contact Admin.",
          null
        )
      );
    }

    // password validation
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json(new ServerResponse(false, null, "Invalid password", null));
    }

    // remove sensitive fields
    let userData = user.toObject();
    delete userData.password;
    delete userData.__v;

    // generate JWT
    const token = generateToken({
      id: userData._id,
      email: userData.email,
      role: userData.role,
    });

    userData.token = token;

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
      user: {
        id: userData._id,
        name: userData.user_name,
        email: userData.email,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json(new ServerResponse(false, null, error.message, error));
  }
}

/**
 * ======================
 * GET LOGGED-IN USER
 * ======================
 */
export async function getUser(req, res) {
  try {
    const user = await User.findById(req.user.id).select("-password -__v");

    if (!user) {
      return res
        .status(404)
        .json(new ServerResponse(false, null, "User Not Found", null));
    }

    return res
      .status(200)
      .json(new ServerResponse(true, user, "Successfully fetch user", null));
  } catch (error) {
    return res
      .status(500)
      .json(new ServerResponse(false, null, error.message, error));
  }
}

/**
 * ======================
 * REGISTER USER
 * ======================
 */
export async function addUser(req, res) {
  try {
    const { user_name, email, mobile, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      user_name,
      email,
      mobile,
      password: hashedPassword,
    });

    return res.status(201).json(
      new ServerResponse(true, user, "User Registered Successfully", null)
    );
  } catch (error) {
    return res
      .status(500)
      .json(new ServerResponse(false, null, error.message, error));
  }
}

/**
 * ======================
 * UPDATE USER
 * ======================
 */
export async function updateUser(req, res) {
  const { user_name, email, gender, address } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { user_name, email, gender, address },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .json(new ServerResponse(false, null, "User Not Found", null));
    }

    return res
      .status(200)
      .json(new ServerResponse(true, user, "Your Detail is Updated", null));
  } catch (error) {
    return res
      .status(500)
      .json(new ServerResponse(false, null, error.message, error));
  }
}

/**
 * ======================
 * DELETE USER (SOFT)
 * ======================
 */
export async function deleteUser(req, res) {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user.id, isDeleted: false, isActive: true },
      { isDeleted: true, isActive: false },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .json(new ServerResponse(false, null, "Your Account not found", null));
    }

    return res
      .status(200)
      .json(new ServerResponse(true, user, "Your Account is Deleted", null));
  } catch (error) {
    return res
      .status(500)
      .json(new ServerResponse(false, null, error.message, error));
  }
}

/**
 * ======================
 * SEARCH USERS
 * ======================
 */
export async function searchUsers(req, res) {
  const { q } = req.query;

  try {
    if (!q || q.trim() === "") {
      return res
        .status(400)
        .json(
          new ServerResponse(false, null, "Search query is required", null)
        );
    }

    const regex = new RegExp(q, "i");

    const users = await User.find({
      isDeleted: false,
      $or: [
        { user_name: { $regex: regex } },
        { email: { $regex: regex } },
      ],
    })
      .select("user_name email mobile")
      .limit(20);

    return res
      .status(200)
      .json(new ServerResponse(true, users, { count: users.length }, null));
  } catch (error) {
    return res
      .status(500)
      .json(new ServerResponse(false, null, error.message, error));
  }
}
