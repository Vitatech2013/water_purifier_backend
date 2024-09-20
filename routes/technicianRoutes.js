const express = require("express");
const router = express.Router();
const {
  registerTechnician,
  getTechnicians,
  updateTechnician,
  deleteTechnician,
} = require("../controllers/technicianContoller");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.post("/register", protect, restrictTo("owner"), registerTechnician);

router.get("/", protect, restrictTo("owner"), getTechnicians);

router.put("/:id", protect, restrictTo("owner"), updateTechnician);

router.delete("/:id", protect, restrictTo("owner"), deleteTechnician);

module.exports = router;
