const Sale = require("../models/sale");
const Product = require("../models/product");
const User = require("../models/user");
const Technician = require("../models/technician");
const Service = require("../models/service");
const { successResponse, errorResponse } = require("../utils/responseUtils");

exports.addSale = async (req, res) => {
  const { name, mobile, productId, saleDate, discountPercentage, salePrice } =
    req.body;

  // Validate required fields
  if (!productId || !saleDate) {
    return errorResponse(res, "Product ID and Sale Date are required", 400);
  }

  // Check the user's role
  const isTechnician = req.role === "technician"; // Adjust this based on your actual role checking logic
  const technicianId = isTechnician ? req.user._id : null; // Set technicianId if technician

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

    // Check if a sale already exists for this user
    let sale = await Sale.findOne({ user: user._id, ownerId: req.owner._id });

    if (!sale) {
      // Create new sale if not found
      sale = new Sale({
        user: user._id,
        ownerId: req.owner._id,
        technicianId: technicianId, // Set technicianId if applicable
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
    } else {
      // Update existing sale record
      const existingProduct = sale.products.find(
        (p) => p.product.toString() === product._id.toString()
      );

      if (!existingProduct) {
        // If product is not already in the sale, add it
        sale.products.push({
          product: product._id,
          saleDate,
          warrantyExpiry,
          salePrice: finalSalePrice,
          discountPercentage: finalDiscountPercentage,
        });
      } else {
        // If product already exists, update the details
        existingProduct.saleDate = saleDate;
        existingProduct.warrantyExpiry = warrantyExpiry;
        existingProduct.salePrice = finalSalePrice;
        existingProduct.discountPercentage = finalDiscountPercentage;
      }
    }

    await sale.save();
    successResponse(res, sale, "Sale added successfully", 201);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

exports.getAllSales = async (req, res) => {
  try {
    let query = { ownerId: req.owner._id };

    if (req.role === "technician") {
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

exports.addService = async (req, res) => {
  const { saleId, productId, serviceType, serviceDate, servicePrice } =
    req.body;

  const technicianId = req.technician ? req.technician._id : null;

  try {
    const sale = await Sale.findOne({ _id: saleId, ownerId: req.owner._id });
    if (!sale)
      return errorResponse(res, "Sale not found or not authorized", 404);

    const product = sale.products.find(
      (prod) => prod.product.toString() === productId
    );
    if (!product)
      return errorResponse(res, "Product not found in the sale", 404);

    product.services.push({
      serviceType,
      serviceDate,
      servicePrice,
    });

    await sale.save();
    successResponse(res, sale, "Service added to sale successfully", 200);
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
