const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber || "",
    role: user.role,
    createdAt: user.createdAt,
  };
}

async function register(req, res, next) {
  try {
    const { name, email, password, phoneNumber } = req.body;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("name, email, and password are required");
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      res.status(400);
      throw new Error("Email already registered");
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashed,
      phoneNumber: phoneNumber ? String(phoneNumber).trim() : "",
      role: "user",
    });

    const token = generateToken({ id: user._id });
    res.status(201).json({ ok: true, token, user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("email and password are required");
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    const token = generateToken({ id: user._id });
    res.json({ ok: true, token, user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };

