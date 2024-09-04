const express = require('express');
const router = express.Router();
const {
  addSale,
  addService,
  getAllSales,
  getSaleById,
} = require('../controllers/saleController');
const cors = require('cors');

const corsOptions = {
  origin: ['http://localhost:5000', 'http://localhost:4200'],
};

router.use(cors(corsOptions));

// Create or update a sale
router.post('/add', addSale);

// Add a service to a sale
router.post('/addservice', addService);

// Get all sales with detailed information
router.get('/', getAllSales);

// Get a specific sale by ID with detailed information
router.get('/:id', getSaleById);

module.exports = router;
