const express = require("express");
const {
  listUsers,
  listCars,
  deleteCar,
  setCarAvailability,
  listEnquiries,
} = require("../controllers/adminController");
const { protect, requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, requireAdmin);

router.get("/users", listUsers);
router.get("/cars", listCars);
router.patch("/cars/:id/availability", setCarAvailability);
router.delete("/cars/:id", deleteCar);
router.get("/enquiries", listEnquiries);

module.exports = router;

