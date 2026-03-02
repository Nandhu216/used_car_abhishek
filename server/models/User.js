const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: "",
    },
    role: {
      type: String,
      default: "buyer",
      enum: ["buyer", "seller", "admin"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

