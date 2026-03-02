const Car = require("../models/Car");
const Payment = require("../models/Payment");

async function createPayment(req, res, next) {
  try {
    const {
      carId,
      paymentType,
      totalAmount,
      downPayment,
      installmentMonths,
    } = req.body;

    if (!carId || !totalAmount) {
      res.status(400);
      throw new Error("carId and totalAmount are required");
    }

    const car = await Car.findById(carId);
    if (!car) {
      res.status(404);
      throw new Error("Car not found");
    }
    if (String(car.sellerId) === String(req.user._id)) {
      res.status(400);
      throw new Error("Seller cannot create payment for own car");
    }

    const total = Number(totalAmount);
    const down = Number(downPayment) || 0;
    const months = Number(installmentMonths) || 0;
    const isInstallment = paymentType === "Installment" && months > 0;
    const remaining = isInstallment ? total - down : 0;
    const monthly = isInstallment && months > 0 ? Math.round(remaining / months) : 0;

    const payment = await Payment.create({
      carId: car._id,
      buyerId: req.user._id,
      sellerId: car.sellerId,
      totalAmount: total,
      downPayment: down,
      remainingAmount: remaining,
      installmentMonths: months,
      monthlyAmount: monthly,
      paymentType: isInstallment ? "Installment" : "Full",
      paymentStatus: "Pending",
    });

    res.status(201).json({ ok: true, payment });
  } catch (err) {
    next(err);
  }
}

async function getMyPayments(req, res, next) {
  try {
    const payments = await Payment.find({ buyerId: req.user._id })
      .populate("carId", "title brand model year price")
      .populate("sellerId", "name email")
      .sort({ createdAt: -1 });

    res.json({ ok: true, count: payments.length, payments });
  } catch (err) {
    next(err);
  }
}

async function updatePaymentStatus(req, res, next) {
  try {
    const { paymentStatus } = req.body;
    if (!["Pending", "Ongoing", "Completed"].includes(paymentStatus)) {
      res.status(400);
      throw new Error("Invalid paymentStatus");
    }

    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      res.status(404);
      throw new Error("Payment not found");
    }
    if (String(payment.sellerId) !== String(req.user._id) && req.user.role !== "admin") {
      res.status(403);
      throw new Error("Not allowed to update this payment");
    }

    payment.paymentStatus = paymentStatus;
    await payment.save();

    res.json({ ok: true, payment });
  } catch (err) {
    next(err);
  }
}

module.exports = { createPayment, getMyPayments, updatePaymentStatus };
