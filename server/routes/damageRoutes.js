const express = require("express");
const {
  createDamageReport,
  getMyDamageReports,
  getCarDamageReports,
  getDamageReportsForSeller,
  respondToDamageReport,
} = require("../controllers/damageController");
const { protect, requireSeller } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createDamageReport);
router.get("/my", protect, getMyDamageReports);
router.get("/seller", protect, requireSeller, getDamageReportsForSeller);
router.get("/car/:carId", protect, getCarDamageReports);
router.put("/:id", protect, respondToDamageReport);

module.exports = router;
