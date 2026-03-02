const Car = require("../models/Car");
const Bid = require("../models/Bid");

async function placeBid(req, res, next) {
  try {
    const { carId, bidAmount } = req.body;
    if (!carId || bidAmount === undefined || bidAmount === null) {
      res.status(400);
      throw new Error("carId and bidAmount are required");
    }

    const car = await Car.findById(carId);
    if (!car) {
      res.status(404);
      throw new Error("Car not found");
    }
    if (!car.isAuction) {
      res.status(400);
      throw new Error("Car is not in auction mode");
    }
    if (!car.isAvailable) {
      res.status(400);
      throw new Error("Car is no longer available");
    }
    if (String(car.sellerId) === String(req.user._id)) {
      res.status(400);
      throw new Error("You cannot bid on your own listing");
    }

    const amount = Number(bidAmount);
    if (!Number.isFinite(amount) || amount <= (car.currentHighestBid || car.startingBid)) {
      res.status(400);
      throw new Error("Bid must be higher than current highest");
    }

    const bid = await Bid.create({
      carId: car._id,
      buyerId: req.user._id,
      bidAmount: amount,
      status: "Pending",
    });

    car.currentHighestBid = amount;
    await car.save();

    res.status(201).json({ ok: true, bid });
  } catch (err) {
    next(err);
  }
}

async function getBidsByCar(req, res, next) {
  try {
    const bids = await Bid.find({ carId: req.params.carId })
      .populate("buyerId", "name email phoneNumber")
      .sort({ bidAmount: -1 });

    res.json({ ok: true, count: bids.length, bids });
  } catch (err) {
    next(err);
  }
}

async function getMyBids(req, res, next) {
  try {
    const bids = await Bid.find({ buyerId: req.user._id })
      .populate("carId", "title brand model year price isAuction currentHighestBid")
      .sort({ createdAt: -1 });

    res.json({ ok: true, count: bids.length, bids });
  } catch (err) {
    next(err);
  }
}

async function getBidsForSeller(req, res, next) {
  try {
    const cars = await Car.find({ sellerId: req.user._id }).select("_id");
    const carIds = cars.map((c) => c._id);
    const bids = await Bid.find({ carId: { $in: carIds } })
      .populate("carId", "title brand model year price isAuction currentHighestBid")
      .populate("buyerId", "name email phoneNumber")
      .sort({ createdAt: -1 });

    res.json({ ok: true, count: bids.length, bids });
  } catch (err) {
    next(err);
  }
}

async function acceptRejectBid(req, res, next) {
  try {
    const { status } = req.body;
    if (!["Accepted", "Rejected"].includes(status)) {
      res.status(400);
      throw new Error("status must be Accepted or Rejected");
    }

    const bid = await Bid.findById(req.params.id).populate("carId");
    if (!bid) {
      res.status(404);
      throw new Error("Bid not found");
    }
    if (String(bid.carId.sellerId) !== String(req.user._id) && req.user.role !== "admin") {
      res.status(403);
      throw new Error("Not allowed to update this bid");
    }
    if (bid.status !== "Pending") {
      res.status(400);
      throw new Error("Bid already processed");
    }

    bid.status = status;
    await bid.save();

    if (status === "Accepted") {
      bid.carId.isAvailable = false;
      await bid.carId.save();
    }

    res.json({ ok: true, bid });
  } catch (err) {
    next(err);
  }
}

module.exports = { placeBid, getBidsByCar, getMyBids, getBidsForSeller, acceptRejectBid };
