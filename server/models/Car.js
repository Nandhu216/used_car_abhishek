const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    mileage: { type: Number, required: true },
    fuelType: {
      type: String,
      required: true,
      enum: ["Petrol", "Diesel", "Electric"],
    },
    transmission: {
      type: String,
      required: true,
      enum: ["Manual", "Automatic"],
    },
    location: { type: String, required: true, trim: true },
    numberOfOwners: { type: Number, default: 1, min: 1 },
    images: [{ type: String, trim: true }],
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isAvailable: { type: Boolean, default: true },
    isAuction: { type: Boolean, default: false },
    startingBid: { type: Number, default: 0 },
    currentHighestBid: { type: Number, default: 0 },
    auctionEndDate: { type: Date, default: null },
    acceptedBidId: { type: mongoose.Schema.Types.ObjectId, ref: "Bid", default: null },
    soldTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    soldPrice: { type: Number, default: 0 },
    deliveryAvailable: { type: Boolean, default: false },
    deliveryCharge: { type: Number, default: 0 },
  },
  { timestamps: true }
);

carSchema.index({ title: "text", brand: "text", model: "text", location: "text" });

module.exports = mongoose.model("Car", carSchema);

