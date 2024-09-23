const express = require("express");
const {
  addSale,
  addService,
  getAllSales,
  getSaleById,
} = require("../controllers/saleController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/add", restrictTo("owner"), addSale);
router.post("/addservice", restrictTo("owner"), addService);
router.get("/", restrictTo("owner"), getAllSales);
router.get("/:id", restrictTo("owner"), getSaleById);

module.exports = router;
