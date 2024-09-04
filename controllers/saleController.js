const Sale = require("../models/sale");
const Product = require("../models/product");
const User = require("../models/user");
const { successResponse, errorResponse } = require("../utils/responseUtils");

// Add a new sale
exports.addSale = async (req, res) => {
  const { name, mobile, productId, saleDate } = req.body;

  try {
    let user = await User.findOne({ mobile });

    if (!user) {
      user = new User({ name, mobile });
      await user.save();
    }

    const product = await Product.findById(productId);
    if (!product) return errorResponse(res, 'Product not found', 404);

    const warrantyExpiry = new Date(saleDate);
    warrantyExpiry.setFullYear(warrantyExpiry.getFullYear() + parseInt(product.warranty));

    let sale = await Sale.findOne({ user: user._id });

    if (!sale) {
      sale = new Sale({
        user: user._id,
        products: [{ product: product._id, saleDate, warrantyExpiry }],
      });
    } else {
      const existingProduct = sale.products.find(p => p.product.toString() === product._id.toString());

      if (!existingProduct) {
        sale.products.push({ product: product._id, saleDate, warrantyExpiry });
      } else {
        existingProduct.saleDate = saleDate;
        existingProduct.warrantyExpiry = warrantyExpiry;
      }
    }

    await sale.save();
    successResponse(res, sale, 'Sale added successfully', 201);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// Add a service to a sale
exports.addService = async (req, res) => {
  const { saleId, productId, serviceTypeId, serviceDate, servicePrice } = req.body;

  try {
    const sale = await Sale.findById(saleId);
    if (!sale) return errorResponse(res, 'Sale not found', 404);

    const productEntry = sale.products.find(p => p.product.toString() === productId.toString());
    if (!productEntry) return errorResponse(res, 'Product not found in the sale', 404);

    productEntry.services.push({
      serviceType: serviceTypeId,
      serviceDate,
      servicePrice,
    });

    await sale.save();
    successResponse(res, sale, 'Service added successfully', 201);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// Get all sales
exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate("user")
      .populate("products.product")
      .populate("products.services.serviceType");

    if (!sales || sales.length === 0) {
      return successResponse(res, null, 'No sales found');
    }

    successResponse(res, sales, 'Sales retrieved successfully');
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// Get a sale by ID
exports.getSaleById = async (req, res) => {
  const { id } = req.params;
  try {
    const sale = await Sale.findById(id)
      .populate("user")
      .populate("products.product")
      .populate("products.services.serviceType");

    if (!sale) return errorResponse(res, 'Sale not found', 404);

    successResponse(res, sale, 'Sale retrieved successfully');
  } catch (err) {
    errorResponse(res, err.message);
  }
};
