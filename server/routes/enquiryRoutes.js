const express = require("express");
const {
  createEnquiry,
  getMyEnquiries,
  getReceivedEnquiries,
  updateEnquiryStatus,
} = require("../controllers/enquiryController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createEnquiry);
router.get("/user", protect, getMyEnquiries);
router.get("/received", protect, getReceivedEnquiries);
router.patch("/:id", protect, updateEnquiryStatus);

module.exports = router;

