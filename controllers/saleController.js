const Sale = require("../models/sale");
const Product = require("../models/product");
const User = require("../models/user");
const Technician = require("../models/technician");
const Service = require("../models/service");
const { successResponse, errorResponse } = require("../utils/responseUtils");

exports.addSale = async (req, res) => {
  const { name, mobile, productId, saleDate, discountPercentage, salePrice } = req.body;

  // Validate required fields
  if (!productId || !saleDate) {
    return errorResponse(res, "Product ID and Sale Date are required", 400);
  }

  // Determine if the current user is a technician
  const isTechnician = req.role === "technician";

  try {
    // Check for existing user by mobile
    let user = await User.findOne({ mobile });

    // If the user exists, check if the owner ID matches
    if (user) {
      // If the existing user is associated with a different owner, create a new record
      if (user.ownerId.toString() !== req.owner._id.toString()) {
        // Create new user record with the new owner
        user = new User({ name, mobile, ownerId: req.owner._id });
        await user.save();
      }
    } else {
      // Create new user if not found
      user = new User({ name, mobile, ownerId: req.owner._id });
      await user.save();
    }

    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) return errorResponse(res, "Product not found", 404);

    // Calculate sale price and discount
    const originalPrice = Number(product.productPrice);
    let finalSalePrice, finalDiscountPercentage;

    if (discountPercentage) {
      finalSalePrice = originalPrice - (originalPrice * discountPercentage) / 100;
      finalDiscountPercentage = discountPercentage;
    } else if (salePrice) {
      finalDiscountPercentage = ((originalPrice - salePrice) / originalPrice) * 100;
      finalSalePrice = salePrice;
    } else {
      return errorResponse(res, "Please provide either sale price or discount percentage", 400);
    }

    // Calculate warranty expiry date
    const warrantyExpiry = new Date(saleDate);
    if (product.warrantyType === "months") {
      warrantyExpiry.setMonth(warrantyExpiry.getMonth() + parseInt(product.warranty, 10));
    } else if (product.warrantyType === "years") {
      warrantyExpiry.setFullYear(warrantyExpiry.getFullYear() + parseInt(product.warranty, 10));
    }

    // Check if a sale already exists for the user and owner
    let sale = await Sale.findOne({ user: user._id, ownerId: req.owner._id });

    if (!sale) {
      // Create new sale if none exists
      sale = new Sale({
        user: user._id,
        ownerId: req.owner._id,
        technicianId: isTechnician ? req.user._id : null, // Save technicianId only if technician
        products: [{
          product: product._id,
          saleDate,
          warrantyExpiry,
          salePrice: finalSalePrice,
          discountPercentage: finalDiscountPercentage,
        }],
      });
    } else {
      // Check if the product is already in the sale
      const existingProduct = sale.products.find(p => p.product.toString() === product._id.toString());

      if (!existingProduct) {
        // Add new product to the sale
        sale.products.push({
          product: product._id,
          saleDate,
          warrantyExpiry,
          salePrice: finalSalePrice,
          discountPercentage: finalDiscountPercentage,
        });
      } else {
        // Update existing product sale details
        existingProduct.saleDate = saleDate;
        existingProduct.warrantyExpiry = warrantyExpiry;
        existingProduct.salePrice = finalSalePrice;
        existingProduct.discountPercentage = finalDiscountPercentage;
      }
    }

    // Save the sale record
    await sale.save();

    successResponse(res, sale, "Sale added successfully", 201);
  } catch (err) {
    console.error('Error adding sale:', err); // Log error details for debugging
    errorResponse(res, err.message);
  }
};



exports.addService = async (req, res) => {
  const { saleId, productId, serviceType, serviceDate, servicePrice } = req.body;

  // Get user ID from the request
  const userId = req.owner ? req.owner._id : req.technician ? req.technician._id : null;

  // Check if the user ID is valid
  if (!userId) {
    return errorResponse(res, "Access denied: Insufficient permissions", 403);
  }

  try {
    // Find the sale record by saleId and check access for both owner and technician
    const sale = await Sale.findOne({
      _id: saleId,
      $or: [{ ownerId: req.owner ? req.owner._id : null }, { technicianId: req.technician ? req.technician._id : null }]
    });
    
    // Check if the sale exists
    if (!sale) {
      return errorResponse(res, "Sale not found or not authorized", 404);
    }

    // Find the product in the sale
    const product = sale.products.find((prod) => prod.product.toString() === productId);
    if (!product) {
      return errorResponse(res, "Product not found in the sale", 404);
    }

    // Add the service to the product's services array
    product.services.push({
      serviceType,
      serviceDate,
      servicePrice,
    });

    // Save the updated sale
    await sale.save();
    successResponse(res, sale, "Service added to sale successfully", 200);
  } catch (err) {
    errorResponse(res, err.message);
  }
};











exports.getAllSales = async (req, res) => {
  try {
    let query = {};

    if (req.role === "owner") {
      if (!req.owner || !req.owner._id) {
        return errorResponse(res, "Owner not found or not authorized", 403);
      }
      query.ownerId = req.owner._id;
    }

    if (req.role === "technician") {
      if (!req.user || !req.user._id) {
        return errorResponse(
          res,
          "Technician not found or not authorized",
          403
        );
      }
      query.technicianId = req.user._id;
    }

    const sales = await Sale.find(query)
      .populate("user")
      .populate("technicianId")
      .populate("products.product")
      .populate("products.services.serviceType");

    if (!sales || sales.length === 0) {
      return successResponse(res, null, "No sales found");
    }

    successResponse(res, sales, "Sales retrieved successfully");
  } catch (err) {
    errorResponse(res, err.message);
  }
};



exports.getSaleById = async (req, res) => {
  const { id } = req.params;
  try {
    const sale = await Sale.findOne({ _id: id, ownerId: req.owner._id })
      .populate("user")
      .populate("technicianId")
      .populate("products.product")
      .populate("products.service");
    if (!sale)
      return errorResponse(res, "Sale not found or not authorized", 404);

    successResponse(res, sale, "Sale retrieved successfully");
  } catch (err) {
    errorResponse(res, err.message);
  }
};
