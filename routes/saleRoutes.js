const express = require("express");
const {
  addSale,
  addService,
  getAllSales,
  getSaleById,
} = require("../controllers/saleController");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const cors = require("cors");

const router = express.Router();
const corsOptions = {
  origin: ["http://78.142.47.247:7002"],
  // origin: ["http://localhost:7000"],
};
router.use(cors(corsOptions));
router.use(protect);

router.post("/add", restrictTo("owner"), addSale);
router.post("/addservice", restrictTo("owner"), addService);
router.get("/", restrictTo("owner"), getAllSales);
router.get("/:id", restrictTo("owner"), getSaleById);

module.exports = router;
