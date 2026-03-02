const express = require("express");
const { createPayment, getMyPayments, updatePaymentStatus } = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createPayment);
router.get("/user", protect, getMyPayments);
router.put("/:id", protect, updatePaymentStatus);

module.exports = router;
