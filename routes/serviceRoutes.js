const express = require("express");
const {
  addService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} = require("../controllers/serviceController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect); // Protect all service routes (ensure the user is authenticated)

// Routes for managing services
router.post("/add", restrictTo("owner"), addService); // Only owner can add services
router.get("/", restrictTo("owner"), getAllServices); // Only owner can fetch all services
router.get("/:id", restrictTo("owner"), getServiceById); // Only owner can get service by id
router.put("/:id", restrictTo("owner"), updateService); // Only owner can update services
router.delete("/:id", restrictTo("owner"), deleteService); // Only owner can mark a service as inactive

module.exports = router;
