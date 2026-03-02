const Car = require("../models/Car");
const Delivery = require("../models/Delivery");

async function createDelivery(req, res, next) {
  try {
    const { carId, deliveryType, deliveryAddress } = req.body;

    if (!carId || !deliveryType) {
      res.status(400);
      throw new Error("carId and deliveryType are required");
    }
    if (!["Pickup", "HomeDelivery"].includes(deliveryType)) {
      res.status(400);
      throw new Error("deliveryType must be Pickup or HomeDelivery");
    }
    if (deliveryType === "HomeDelivery" && !deliveryAddress) {
      res.status(400);
      throw new Error("deliveryAddress required for Home Delivery");
    }

    const car = await Car.findById(carId);
    if (!car) {
      res.status(404);
      throw new Error("Car not found");
    }
    if (String(car.sellerId) === String(req.user._id)) {
      res.status(400);
      throw new Error("Seller cannot request delivery for own car");
    }

    const delivery = await Delivery.create({
      carId: car._id,
      buyerId: req.user._id,
      sellerId: car.sellerId,
      deliveryType,
      deliveryAddress: (deliveryAddress || "").trim(),
      deliveryStatus: "Pending",
    });

    res.status(201).json({ ok: true, delivery });
  } catch (err) {
    next(err);
  }
}

async function getMyDeliveries(req, res, next) {
  try {
    const deliveries = await Delivery.find({ buyerId: req.user._id })
      .populate("carId", "title brand model year price")
      .sort({ createdAt: -1 });

    res.json({ ok: true, count: deliveries.length, deliveries });
  } catch (err) {
    next(err);
  }
}

async function getSellerDeliveries(req, res, next) {
  try {
    const deliveries = await Delivery.find({ sellerId: req.user._id })
      .populate("carId", "title brand model year price")
      .populate("buyerId", "name email phoneNumber")
      .sort({ createdAt: -1 });

    res.json({ ok: true, count: deliveries.length, deliveries });
  } catch (err) {
    next(err);
  }
}

async function updateDeliveryStatus(req, res, next) {
  try {
    const { deliveryStatus } = req.body;
    if (!["Pending", "Shipped", "Delivered"].includes(deliveryStatus)) {
      res.status(400);
      throw new Error("Invalid deliveryStatus");
    }

    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) {
      res.status(404);
      throw new Error("Delivery not found");
    }
    if (String(delivery.sellerId) !== String(req.user._id) && req.user.role !== "admin") {
      res.status(403);
      throw new Error("Not allowed");
    }

    delivery.deliveryStatus = deliveryStatus;
    await delivery.save();

    res.json({ ok: true, delivery });
  } catch (err) {
    next(err);
  }
}

module.exports = { createDelivery, getMyDeliveries, getSellerDeliveries, updateDeliveryStatus };
