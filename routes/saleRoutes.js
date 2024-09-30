const express = require("express");
const {
  addSale,
  addService,
  getAllSales,
  getSaleById,
} = require("../controllers/saleController");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const cors = require("cors");
const corsOptions = require("../constants");

const router = express.Router();

router.use(cors(corsOptions));
router.use(protect);

router.post("/add", restrictTo("owner"), addSale);
router.post("/addservice", restrictTo("owner"), addService);
router.get("/", getAllSales);
router.get("/:id", restrictTo("owner"), getSaleById);

module.exports = router;
