const express = require("express");
const {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  getMyCars,
  markAsSold,
} = require("../controllers/carController");
const { protect, requireAdmin, requireSeller } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getCars);
router.get("/my", protect, requireSeller, getMyCars);
router.get("/:id", getCarById);
router.post("/", protect, requireSeller, createCar);
router.put("/:id", protect, updateCar);
router.patch("/:id/sold", protect, markAsSold);
router.delete("/:id", protect, requireAdmin, deleteCar);

module.exports = router;

