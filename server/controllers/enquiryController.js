const Car = require("../models/Car");
const Enquiry = require("../models/Enquiry");

async function createEnquiry(req, res, next) {
  try {
    const { carId, message } = req.body;
    if (!carId || !message) {
      res.status(400);
      throw new Error("carId and message are required");
    }

    const car = await Car.findById(carId);
    if (!car) {
      res.status(404);
      throw new Error("Car not found");
    }

    if (String(car.sellerId) === String(req.user._id)) {
      res.status(400);
      throw new Error("You cannot enquire on your own listing");
    }

    const enquiry = await Enquiry.create({
      carId: car._id,
      buyerId: req.user._id,
      sellerId: car.sellerId,
      message: String(message).trim(),
      status: "Sent",
    });

    res.status(201).json({ ok: true, enquiry });
  } catch (err) {
    next(err);
  }
}

async function getMyEnquiries(req, res, next) {
  try {
    const enquiries = await Enquiry.find({ buyerId: req.user._id })
      .populate("carId", "title brand model year price mileage fuelType transmission location images")
      .populate("sellerId", "name email phoneNumber")
      .sort({ createdAt: -1 });

    res.json({ ok: true, count: enquiries.length, enquiries });
  } catch (err) {
    next(err);
  }
}

async function getReceivedEnquiries(req, res, next) {
  try {
    const enquiries = await Enquiry.find({ sellerId: req.user._id })
      .populate("carId", "title brand model year price mileage fuelType transmission location images")
      .populate("buyerId", "name email phoneNumber")
      .sort({ createdAt: -1 });

    res.json({ ok: true, count: enquiries.length, enquiries });
  } catch (err) {
    next(err);
  }
}

async function updateEnquiryStatus(req, res, next) {
  try {
    const { status } = req.body;
    const allowed = ["Sent", "Responded", "Closed"];
    if (!allowed.includes(status)) {
      res.status(400);
      throw new Error(`status must be one of: ${allowed.join(", ")}`);
    }

    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      res.status(404);
      throw new Error("Enquiry not found");
    }

    const isSeller = String(enquiry.sellerId) === String(req.user._id);
    const isAdmin = req.user.role === "admin";
    if (!isSeller && !isAdmin) {
      res.status(403);
      throw new Error("Not allowed to update this enquiry");
    }

    enquiry.status = status;
    const saved = await enquiry.save();
    res.json({ ok: true, enquiry: saved });
  } catch (err) {
    next(err);
  }
}

module.exports = { createEnquiry, getMyEnquiries, getReceivedEnquiries, updateEnquiryStatus };

