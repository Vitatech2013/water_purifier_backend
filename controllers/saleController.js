const Sale = require("../models/sale");
const Product = require("../models/product");
const User = require("../models/user");
const { successResponse, errorResponse } = require("../utils/responseUtils");

// Add Sale controller
exports.addSale = async (req, res) => {
  const {
    name,
    mobile,
    productId,
    saleDate,
    discountPercentage,
    salePrice,
  } = req.body;

  try {
    // Find or create a user by mobile number and ownerId
    let user = await User.findOne({ mobile, ownerId: req.owner._id });  // Reference `req.owner._id`
    if (!user) {
      user = new User({ name, mobile, ownerId: req.owner._id });  // Reference `req.owner._id`
      await user.save();
    }

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) return errorResponse(res, "Product not found", 404);

    const originalPrice = Number(product.productPrice);
    let finalSalePrice, finalDiscountPercentage;

    // Calculate sale price based on discount or salePrice
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

    // Calculate warranty expiry based on sale date
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

    // Find if a sale already exists for the user
    let sale = await Sale.findOne({ user: user._id, ownerId: req.owner._id });  // Reference `req.owner._id`

    // If sale doesn't exist, create a new one
    if (!sale) {
      sale = new Sale({
        user: user._id,
        ownerId: req.owner._id,  // Reference `req.owner._id`
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
      // If the sale exists, update the existing product or add a new one
      const existingProduct = sale.products.find(
        (p) => p.product.toString() === product._id.toString()
      );

      if (!existingProduct) {
        sale.products.push({
          product: product._id,
          saleDate,
          warrantyExpiry,
          salePrice: finalSalePrice,
          discountPercentage: finalDiscountPercentage,
        });
      } else {
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


// Add Service controller
exports.addService = async (req, res) => {
  const { saleId, productId, serviceTypeId, serviceDate, servicePrice } =
    req.body;

  try {
    // Find the sale by saleId and ownerId
    const sale = await Sale.findOne({ _id: saleId, ownerId: req.owner._id });
    if (!sale) return errorResponse(res, "Sale not found", 404);

    // Find the product in the sale
    const productEntry = sale.products.find(
      (p) => p.product.toString() === productId.toString()
    );
    if (!productEntry)
      return errorResponse(res, "Product not found in the sale", 404);

    // Add the service to the product's services array
    productEntry.services.push({
      serviceType: serviceTypeId,
      serviceDate,
      servicePrice,
    });

    await sale.save();
    successResponse(res, sale, "Service added successfully", 201);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// Get all sales controller
exports.getAllSales = async (req, res) => {
  try {
    // Find all sales by ownerId
    const sales = await Sale.find({ ownerId: req.owner._id })
      .populate("user")
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

// Get sale by id controller
exports.getSaleById = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the sale by id and ownerId
    const sale = await Sale.findOne({ _id: id, ownerId: req.owner._id })
      .populate("user")
      .populate("products.product")
      .populate("products.services.serviceType");

    if (!sale)
      return errorResponse(res, "Sale not found or not authorized", 404);

    successResponse(res, sale, "Sale retrieved successfully");
  } catch (err) {
    errorResponse(res, err.message);
  }
};
