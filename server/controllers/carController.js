const Car = require("../models/Car");

function toNumberOrUndefined(v) {
  if (v === undefined || v === null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

async function getCars(req, res, next) {
  try {
    const {
      brand,
      fuelType,
      transmission,
      location,
      q,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      isAvailable,
    } = req.query;

    const filter = {};

    if (brand) filter.brand = new RegExp(`^${String(brand).trim()}$`, "i");
    if (fuelType) filter.fuelType = String(fuelType).trim();
    if (transmission) filter.transmission = String(transmission).trim();
    if (location) filter.location = new RegExp(String(location).trim(), "i");

    const minP = toNumberOrUndefined(minPrice);
    const maxP = toNumberOrUndefined(maxPrice);
    if (minP !== undefined || maxP !== undefined) {
      filter.price = {};
      if (minP !== undefined) filter.price.$gte = minP;
      if (maxP !== undefined) filter.price.$lte = maxP;
    }

    const minY = toNumberOrUndefined(minYear);
    const maxY = toNumberOrUndefined(maxYear);
    if (minY !== undefined || maxY !== undefined) {
      filter.year = {};
      if (minY !== undefined) filter.year.$gte = minY;
      if (maxY !== undefined) filter.year.$lte = maxY;
    }

    if (isAvailable === "true") filter.isAvailable = true;
    if (isAvailable === "false") filter.isAvailable = false;

    if (q) {
      filter.$text = { $search: String(q) };
    }

    const cars = await Car.find(filter)
      .populate("sellerId", "name email phoneNumber role")
      .sort({ createdAt: -1 });

    res.json({ ok: true, count: cars.length, cars });
  } catch (err) {
    next(err);
  }
}

async function getCarById(req, res, next) {
  try {
    const car = await Car.findById(req.params.id).populate(
      "sellerId",
      "name email phoneNumber role"
    );
    if (!car) {
      res.status(404);
      throw new Error("Car not found");
    }
    res.json({ ok: true, car });
  } catch (err) {
    next(err);
  }
}

async function createCar(req, res, next) {
  try {
    const {
      title,
      brand,
      model,
      year,
      price,
      mileage,
      fuelType,
      transmission,
      location,
      images,
      isAvailable,
    } = req.body;

    const required = { title, brand, model, year, price, mileage, fuelType, transmission, location };
    for (const [k, v] of Object.entries(required)) {
      if (v === undefined || v === null || v === "") {
        res.status(400);
        throw new Error(`${k} is required`);
      }
    }

    const car = await Car.create({
      title: String(title).trim(),
      brand: String(brand).trim(),
      model: String(model).trim(),
      year: Number(year),
      price: Number(price),
      mileage: Number(mileage),
      fuelType: String(fuelType).trim(),
      transmission: String(transmission).trim(),
      location: String(location).trim(),
      images: Array.isArray(images) ? images.map((x) => String(x).trim()).filter(Boolean) : [],
      sellerId: req.user._id,
      isAvailable: isAvailable === undefined ? true : Boolean(isAvailable),
    });

    res.status(201).json({ ok: true, car });
  } catch (err) {
    next(err);
  }
}

async function updateCar(req, res, next) {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      res.status(404);
      throw new Error("Car not found");
    }

    const isOwner = String(car.sellerId) === String(req.user._id);
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      res.status(403);
      throw new Error("Not allowed to update this listing");
    }

    const updatable = [
      "title",
      "brand",
      "model",
      "year",
      "price",
      "mileage",
      "fuelType",
      "transmission",
      "location",
      "images",
      "isAvailable",
    ];

    for (const key of updatable) {
      if (req.body[key] === undefined) continue;
      if (key === "images") {
        car.images = Array.isArray(req.body.images)
          ? req.body.images.map((x) => String(x).trim()).filter(Boolean)
          : [];
      } else if (["year", "price", "mileage"].includes(key)) {
        car[key] = Number(req.body[key]);
      } else if (key === "isAvailable") {
        car.isAvailable = Boolean(req.body.isAvailable);
      } else {
        car[key] = String(req.body[key]).trim();
      }
    }

    const saved = await car.save();
    res.json({ ok: true, car: saved });
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

async function getMyCars(req, res, next) {
  try {
    const cars = await Car.find({ sellerId: req.user._id }).sort({ createdAt: -1 });
    res.json({ ok: true, count: cars.length, cars });
  } catch (err) {
    next(err);
  }
}

module.exports = { getCars, getCarById, createCar, updateCar, deleteCar, getMyCars };

