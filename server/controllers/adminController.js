const Car = require("../models/Car");
const Enquiry = require("../models/Enquiry");
const User = require("../models/User");
const Bid = require("../models/Bid");
const Payment = require("../models/Payment");
const Delivery = require("../models/Delivery");
const DamageReport = require("../models/DamageReport");

async function listUsers(_req, res, next) {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ ok: true, count: users.length, users });
  } catch (err) {
    next(err);
  }
}

async function listCars(_req, res, next) {
  try {
    const cars = await Car.find()
      .populate("sellerId", "name email phoneNumber role")
      .sort({ createdAt: -1 });
    res.json({ ok: true, count: cars.length, cars });
  } catch (err) {
    next(err);
  }
}

async function deleteCar(req, res, next) {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      res.status(404);
      throw new Error("Car not found");
    }
    await car.deleteOne();
    res.json({ ok: true, message: "Car deleted" });
  } catch (err) {
    next(err);
  }
}

async function setCarAvailability(req, res, next) {
  try {
    const { isAvailable } = req.body;
    const car = await Car.findById(req.params.id);
    if (!car) {
      res.status(404);
      throw new Error("Car not found");
    }
    car.isAvailable = Boolean(isAvailable);
    const saved = await car.save();
    res.json({ ok: true, car: saved });
  } catch (err) {
    next(err);
  }
}

async function listEnquiries(_req, res, next) {
  try {
    const enquiries = await Enquiry.find()
      .populate("carId", "title brand model year price location")
      .populate("buyerId", "name email phoneNumber")
      .populate("sellerId", "name email phoneNumber")
      .sort({ createdAt: -1 });

    res.json({ ok: true, count: enquiries.length, enquiries });
  } catch (err) {
    next(err);
  }
}

async function listBids(_req, res, next) {
  try {
    const bids = await Bid.find()
      .populate("carId", "title brand model year price isAuction currentHighestBid")
      .populate("buyerId", "name email phoneNumber")
      .sort({ createdAt: -1 });
    res.json({ ok: true, count: bids.length, bids });
  } catch (err) {
    next(err);
  }
}

async function listPayments(_req, res, next) {
  try {
    const payments = await Payment.find()
      .populate("carId", "title brand model year price")
      .populate("buyerId", "name email")
      .populate("sellerId", "name email")
      .sort({ createdAt: -1 });
    res.json({ ok: true, count: payments.length, payments });
  } catch (err) {
    next(err);
  }
}

async function listDeliveries(_req, res, next) {
  try {
    const deliveries = await Delivery.find()
      .populate("carId", "title brand model year price")
      .populate("buyerId", "name email phoneNumber")
      .populate("sellerId", "name email")
      .sort({ createdAt: -1 });
    res.json({ ok: true, count: deliveries.length, deliveries });
  } catch (err) {
    next(err);
  }
}

async function listDamageReports(_req, res, next) {
  try {
    const damageReports = await DamageReport.find()
      .populate("carId", "title brand model year price")
      .populate("buyerId", "name email phoneNumber")
      .sort({ createdAt: -1 });
    res.json({ ok: true, count: damageReports.length, damageReports });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listUsers,
  listCars,
  deleteCar,
  setCarAvailability,
  listEnquiries,
  listBids,
  listPayments,
  listDeliveries,
  listDamageReports,
};

