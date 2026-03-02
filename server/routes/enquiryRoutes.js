const express = require("express");
const {
  createEnquiry,
  getMyEnquiries,
  getReceivedEnquiries,
  updateEnquiryStatus,
} = require("../controllers/enquiryController");
const { protect, requireSeller } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createEnquiry);
router.get("/user", protect, getMyEnquiries);
router.get("/received", protect, requireSeller, getReceivedEnquiries);
router.get("/seller", protect, requireSeller, getReceivedEnquiries);
router.patch("/:id", protect, requireSeller, updateEnquiryStatus);

module.exports = router;

