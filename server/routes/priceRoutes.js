const express = require("express");
const { recommendPrice } = require("../utils/priceRecommendation");

const router = express.Router();

router.post("/recommendation", (req, res) => {
  const { brand, model, year, mileage } = req.body || {};
  if (!year || mileage === undefined) {
    res.status(400).json({ ok: false, message: "year and mileage are required" });
    return;
  }
  const result = recommendPrice({ brand, model, year, mileage });
  res.json({ ok: true, ...result });
});

module.exports = router;

