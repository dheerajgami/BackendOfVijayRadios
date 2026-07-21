import jwt from "jsonwebtoken";
import ServerResponse from "../response/pattern.js";

export const protect = (req, res, next) => {
  let token;

  // from header
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // from cookie
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res
      .status(401)
      .json(new ServerResponse(false, null, "Not authorized", null));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return res
      .status(401)
      .json(new ServerResponse(false, null, "Invalid token", null));
  }
};
