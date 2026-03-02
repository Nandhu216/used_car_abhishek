const express = require("express");
const {
  createDelivery,
  getMyDeliveries,
  getSellerDeliveries,
  updateDeliveryStatus,
} = require("../controllers/deliveryController");
const { protect, requireSeller } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createDelivery);
router.get("/user", protect, getMyDeliveries);
router.get("/seller", protect, requireSeller, getSellerDeliveries);
router.put("/:id", protect, updateDeliveryStatus);

module.exports = router;
