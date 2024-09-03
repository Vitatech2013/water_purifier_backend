const Sale = require('../models/sale');

// Get all sales
exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate('products.productId'); // Populate product details
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new sale
exports.addSale = async (req, res) => {
  const saleData = {
    saleDate: req.body.saleDate,
    products: req.body.products,
    customerName: req.body.customerName,
    Mobile: req.body.Mobile,
    Address: req.body.Address,
  };

  const sale = new Sale(saleData);

  try {
    const newSale = await sale.save();
    res.status(201).json(newSale);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get a sale by ID
exports.getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate('products.productId');
    if (!sale) return res.status(404).json({ message: 'Sale not found' });
    res.json(sale);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
