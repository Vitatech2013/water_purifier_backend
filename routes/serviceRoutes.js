const express = require("express");
const cors = require("cors");

const {
  addService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} = require("../controllers/serviceController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

const router = express.Router();
const corsOptions = require("../constants");

router.use(cors(corsOptions));
router.use(protect);

router.post("/add", restrictTo("owner"), addService);
router.get("/", getAllServices);
router.get("/:id", restrictTo("owner"), getServiceById);
router.put("/:id", restrictTo("owner"), updateService);
router.delete("/:id", restrictTo("owner"), deleteService);

module.exports = router;
