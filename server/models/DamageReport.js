const mongoose = require("mongoose");

const damageReportSchema = new mongoose.Schema(
  {
    carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true, trim: true },
    damageImages: [{ type: String, trim: true }],
    requestedReductionAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Countered"],
      default: "Pending",
    },
    finalAgreedPrice: { type: Number, default: null },
    sellerResponse: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DamageReport", damageReportSchema);
