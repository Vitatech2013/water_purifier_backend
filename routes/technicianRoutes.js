const express = require("express");
const router = express.Router();
const {
  registerTechnician,
  getTechnicians,
  updateTechnician,
  deleteTechnician,
} = require("../controllers/technicianContoller");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const cors = require("cors");

const corsOptions = {
  origin: ["http://78.142.47.247:7002"],
  // origin: ["http://localhost:7000"],
};
router.use(cors(corsOptions));
router.post("/register", protect, restrictTo("owner"), registerTechnician);

router.get("/", protect, restrictTo("owner"), getTechnicians);

router.put("/:id", protect, restrictTo("owner"), updateTechnician);

router.delete("/:id", protect, restrictTo("owner"), deleteTechnician);

module.exports = router;
