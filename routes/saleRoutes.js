const express = require("express");
const router = express.Router();
const {
  addSale,
  addService,
  getAllSales,
  getSaleById,
} = require("../controllers/saleController");
const cors = require("cors");

const corsOptions = {
  origin: ["http://localhost:5000", "http://localhost:4200"],
};

router.use(cors(corsOptions));

router.post("/add", addSale);

router.post("/addservice", addService);

router.get("/", getAllSales);

router.get("/:id", getSaleById);

module.exports = router;
