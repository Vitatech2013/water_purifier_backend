const express = require("express");
const router = express.Router();
const {
  addSale,
  addService,
  getAllSales,
  getSaleById,
} = require("../controllers/saleController");
const cors = require("cors");
const { protect } = require("../middleware/authMiddleware");

const corsOptions = {
  // origin: ["http://78.142.47.247:7000"],
  origin: ["http://localhost:7000"],
};
router.use(cors(corsOptions));

router.use(protect);

router.post("/add", addSale);
router.post("/addservice", addService);
router.get("/", getAllSales);
router.get("/:id", getSaleById);

module.exports = router;
