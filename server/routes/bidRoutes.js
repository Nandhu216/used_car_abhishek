const express = require("express");
const { placeBid, getBidsByCar, getMyBids, getBidsForSeller, acceptRejectBid } = require("../controllers/bidController");
const { protect, requireSeller } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, placeBid);
router.get("/my", protect, getMyBids);
router.get("/seller", protect, requireSeller, getBidsForSeller);
router.get("/:carId", getBidsByCar);
router.patch("/:id/respond", protect, requireSeller, acceptRejectBid);

module.exports = router;
