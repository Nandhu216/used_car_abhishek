const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    totalAmount: { type: Number, required: true },
    downPayment: { type: Number, default: 0 },
    remainingAmount: { type: Number, default: 0 },
    installmentMonths: { type: Number, default: 0 },
    monthlyAmount: { type: Number, default: 0 },
    paymentType: { type: String, enum: ["Full", "Installment"], default: "Full" },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Ongoing", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
