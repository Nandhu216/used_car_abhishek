const express = require("express");
const {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  getMyCars,
} = require("../controllers/carController");
const { protect, requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getCars);
router.get("/my", protect, getMyCars);
router.get("/:id", getCarById);
router.post("/", protect, createCar);
router.put("/:id", protect, updateCar);
router.delete("/:id", protect, requireAdmin, deleteCar);

module.exports = router;

