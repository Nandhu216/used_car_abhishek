const express = require("express");
const {
  listUsers,
  updateUser,
  deleteUser,
  listCars,
  deleteCar,
  setCarAvailability,
  listEnquiries,
  listBids,
  listPayments,
  listDeliveries,
  listDamageReports,
} = require("../controllers/adminController");
const { protect, requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, requireAdmin);

router.get("/users", listUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.get("/cars", listCars);
router.patch("/cars/:id/availability", setCarAvailability);
router.delete("/cars/:id", deleteCar);
router.get("/enquiries", listEnquiries);
router.get("/bids", listBids);
router.get("/payments", listPayments);
router.get("/deliveries", listDeliveries);
router.get("/damage-reports", listDamageReports);

module.exports = router;

