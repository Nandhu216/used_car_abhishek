const Car = require("../models/Car");
const Enquiry = require("../models/Enquiry");
const User = require("../models/User");

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

module.exports = { listUsers, listCars, deleteCar, setCarAvailability, listEnquiries };

