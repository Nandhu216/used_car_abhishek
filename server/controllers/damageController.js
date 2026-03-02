const Car = require("../models/Car");
const DamageReport = require("../models/DamageReport");

async function createDamageReport(req, res, next) {
  try {
    const { carId, description, damageImages, requestedReductionAmount } = req.body;

    if (!carId || !description || requestedReductionAmount === undefined) {
      res.status(400);
      throw new Error("carId, description, and requestedReductionAmount are required");
    }

    const car = await Car.findById(carId);
    if (!car) {
      res.status(404);
      throw new Error("Car not found");
    }
    if (String(car.sellerId) === String(req.user._id)) {
      res.status(400);
      throw new Error("You cannot report damage on your own listing");
    }

    const report = await DamageReport.create({
      carId: car._id,
      buyerId: req.user._id,
      description: String(description).trim(),
      damageImages: Array.isArray(damageImages) ? damageImages.map((x) => String(x).trim()).filter(Boolean) : [],
      requestedReductionAmount: Number(requestedReductionAmount),
      status: "Pending",
    });

    res.status(201).json({ ok: true, damageReport: report });
  } catch (err) {
    next(err);
  }
}

async function getMyDamageReports(req, res, next) {
  try {
    const reports = await DamageReport.find({ buyerId: req.user._id })
      .populate("carId", "title brand model year price")
      .sort({ createdAt: -1 });

    res.json({ ok: true, count: reports.length, damageReports: reports });
  } catch (err) {
    next(err);
  }
}

async function getCarDamageReports(req, res, next) {
  try {
    const reports = await DamageReport.find({ carId: req.params.carId })
      .populate("buyerId", "name email phoneNumber")
      .sort({ createdAt: -1 });

    res.json({ ok: true, count: reports.length, damageReports: reports });
  } catch (err) {
    next(err);
  }
}

async function getDamageReportsForSeller(req, res, next) {
  try {
    const cars = await Car.find({ sellerId: req.user._id }).select("_id");
    const carIds = cars.map((c) => c._id);
    const reports = await DamageReport.find({ carId: { $in: carIds } })
      .populate("carId", "title brand model year price")
      .populate("buyerId", "name email phoneNumber")
      .sort({ createdAt: -1 });

    res.json({ ok: true, count: reports.length, damageReports: reports });
  } catch (err) {
    next(err);
  }
}

async function respondToDamageReport(req, res, next) {
  try {
    const { status, finalAgreedPrice, sellerResponse } = req.body;

    if (!["Accepted", "Rejected", "Countered"].includes(status)) {
      res.status(400);
      throw new Error("status must be Accepted, Rejected, or Countered");
    }

    const report = await DamageReport.findById(req.params.id).populate("carId");
    if (!report) {
      res.status(404);
      throw new Error("Damage report not found");
    }
    if (String(report.carId.sellerId) !== String(req.user._id) && req.user.role !== "admin") {
      res.status(403);
      throw new Error("Not allowed");
    }
    if (report.status !== "Pending") {
      res.status(400);
      throw new Error("Report already responded");
    }

    report.status = status;
    report.sellerResponse = String(sellerResponse || "").trim();
    if (status === "Accepted" && finalAgreedPrice != null) {
      report.finalAgreedPrice = Number(finalAgreedPrice);
    }
    if (status === "Countered" && finalAgreedPrice != null) {
      report.finalAgreedPrice = Number(finalAgreedPrice);
    }
    await report.save();

    res.json({ ok: true, damageReport: report });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createDamageReport,
  getMyDamageReports,
  getCarDamageReports,
  getDamageReportsForSeller,
  respondToDamageReport,
};
