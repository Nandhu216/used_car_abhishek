const bcryptjs = require("bcryptjs");
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

async function updateUser(req, res, next) {
  try {
    const { name, email, phoneNumber, role, newPassword } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    if (name !== undefined && name !== null) user.name = String(name).trim();
    if (phoneNumber !== undefined) user.phoneNumber = String(phoneNumber || "").trim();
    if (role !== undefined && ["buyer", "seller", "admin"].includes(role)) {
      user.role = role;
    }
    if (email !== undefined && email !== null) {
      const newEmail = String(email).toLowerCase().trim();
      if (!newEmail) {
        res.status(400);
        throw new Error("Email is required");
      }
      const existing = await User.findOne({ email: newEmail, _id: { $ne: user._id } });
      if (existing) {
        res.status(400);
        throw new Error("Email already in use by another user");
      }
      user.email = newEmail;
    }
    if (newPassword !== undefined && String(newPassword).trim() !== "") {
      const plain = String(newPassword).trim();
      if (plain.length < 6) {
        res.status(400);
        throw new Error("Password must be at least 6 characters");
      }
      const salt = await bcryptjs.genSalt(10);
      user.password = await bcryptjs.hash(plain, salt);
    }
    await user.save();
    const updated = await User.findById(user._id).select("-password");
    res.json({ ok: true, user: updated });
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const targetId = req.params.id;
    if (String(targetId) === String(req.user._id)) {
      res.status(400);
      throw new Error("You cannot delete your own account");
    }
    const user = await User.findById(targetId);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    await user.deleteOne();
    res.json({ ok: true, message: "User deleted" });
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
  updateUser,
  deleteUser,
  listCars,
  deleteCar,
  setCarAvailability,
  listEnquiries,
  listBids,
  listPayments,
  listDeliveries,
  listDamageReports,
};

