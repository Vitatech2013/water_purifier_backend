const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');

const cors = require("cors");

const corsOptions = {
  origin: ["http://localhost:5000", "http://localhost:4200"],
};
router.use(cors(corsOptions));

router.get('/sales', saleController.getAllSales);
router.post('/addsale', saleController.addSale);
router.get('/:id', saleController.getSaleById);
module.exports = router;
