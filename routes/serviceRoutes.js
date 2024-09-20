const express = require("express");
const {
  addServiceType,
  getAllServiceTypes,
  getServiceTypeById,
  updateServiceType,
  deleteServiceType,
} = require("../controllers/serviceController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
const cors = require("cors");
const corsOptions = {
  // origin: ["http://78.142.47.247:7000"],
  origin: ["http://localhost:7000"],
};
router.use(cors(corsOptions));
router.use(protect);

router.post("/add", addServiceType);
router.get("/", getAllServiceTypes);
router.get("/:id", getServiceTypeById);
router.put("/:id", updateServiceType);
router.delete("/:id", deleteServiceType);

module.exports = router;
