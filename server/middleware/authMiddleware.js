const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const hasBearer = header.startsWith("Bearer ");
    if (!hasBearer) {
      res.status(401);
      throw new Error("Not authorized (missing token)");
    }

    const token = header.split(" ")[1];
    const secret = process.env.JWT_SECRET || "dev_secret_change_me";
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      res.status(401);
      throw new Error("Not authorized (user not found)");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401);
    next(err);
  }
}

function requireAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") return next();
  res.status(403);
  next(new Error("Admin access required"));
}

module.exports = { protect, requireAdmin };

