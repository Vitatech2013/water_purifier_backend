const Sale = require("../models/sale");
const Product = require("../models/product");
const User = require("../models/user");
const Technician = require("../models/technician");
const Service = require("../models/service");
const { successResponse, errorResponse } = require("../utils/responseUtils");

// Add a new sale
exports.addSale = async (req, res) => {
  const { name, mobile, productId, saleDate, discountPercentage, salePrice } =
    req.body;

  // Validate required fields
  if (!productId || !saleDate) {
    return errorResponse(res, "Product ID and Sale Date are required", 400);
  }

  const technicianId = req.technician._id;

  try {
    // Find or create user
    let user = await User.findOne({ mobile, ownerId: req.owner._id });
    if (!user) {
      user = new User({ name, mobile, ownerId: req.owner._id });
      await user.save();
    }

    // Find product
    const product = await Product.findById(productId);
    if (!product) return errorResponse(res, "Product not found", 404);

    // Calculate final sale price and discount percentage
    const originalPrice = Number(product.productPrice);
    let finalSalePrice, finalDiscountPercentage;

    if (discountPercentage) {
      finalSalePrice =
        originalPrice - (originalPrice * discountPercentage) / 100;
      finalDiscountPercentage = discountPercentage;
    } else if (salePrice) {
      finalDiscountPercentage =
        ((originalPrice - salePrice) / originalPrice) * 100;
      finalSalePrice = salePrice;
    } else {
      return errorResponse(
        res,
        "Please provide either sale price or discount percentage",
        400
      );
    }

    // Calculate warranty expiry date
    const warrantyExpiry = new Date(saleDate);
    if (product.warrantyType === "months") {
      warrantyExpiry.setMonth(
        warrantyExpiry.getMonth() + parseInt(product.warranty)
      );
    } else if (product.warrantyType === "years") {
      warrantyExpiry.setFullYear(
        warrantyExpiry.getFullYear() + parseInt(product.warranty)
      );
    }

    // Create and save sale
    const sale = new Sale({
      user: user._id,
      ownerId: req.owner._id,
      technicianId: technicianId,
      products: [
        {
          product: product._id,
          saleDate,
          warrantyExpiry,
          salePrice: finalSalePrice,
          discountPercentage: finalDiscountPercentage,
        },
      ],
    });

    await sale.save();
    successResponse(res, sale, "Sale added successfully", 201);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// Add service to a sale
exports.addService = async (req, res) => {
  const { saleId, serviceId, servicePrice } = req.body;

  // Get technicianId from the request
  const technicianId = req.technician._id;

  try {
    // Find sale by saleId and ownerId
    const sale = await Sale.findOne({ _id: saleId, ownerId: req.owner._id });
    if (!sale)
      return errorResponse(res, "Sale not found or not authorized", 404);

    // Check if the service exists
    const service = await Service.findById(serviceId);
    if (!service) return errorResponse(res, "Service not found", 404);

    // Add service to the sale
    sale.products.push({
      service: service._id,
      servicePrice,
      technicianId, // Associate technician with the service
    });

    await sale.save();
    successResponse(res, sale, "Service added to sale successfully", 200);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// Get all sales for the owner
exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find({ ownerId: req.owner._id })
      .populate("user")
      .populate("technicianId") // Populate technicianId
      .populate("products.product")
      .populate("products.service"); // Adjust if necessary for service population

    if (!sales || sales.length === 0) {
      return successResponse(res, null, "No sales found");
    }

    successResponse(res, sales, "Sales retrieved successfully");
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// Get sale by ID
exports.getSaleById = async (req, res) => {
  const { id } = req.params;
  try {
    const sale = await Sale.findOne({ _id: id, ownerId: req.owner._id })
      .populate("user")
      .populate("technicianId") // Populate technicianId
      .populate("products.product")
      .populate("products.service"); // Adjust if necessary for service population

    if (!sale)
      return errorResponse(res, "Sale not found or not authorized", 404);

    successResponse(res, sale, "Sale retrieved successfully");
  } catch (err) {
    errorResponse(res, err.message);
  }
};
