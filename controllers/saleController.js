const Sale = require("../models/sale");
const Product = require("../models/product");
const User = require("../models/user");
const { successResponse, errorResponse } = require("../utils/responseUtils");

exports.addSale = async (req, res) => {
  const {
    name,
    mobile,
    ownerId,
    productId,
    saleDate,
    discountPercentage,
    salePrice,
  } = req.body;

  try {
    let user = await User.findOne({ mobile, ownerId });

    if (!user) {
      user = new User({ name, mobile, ownerId });
      await user.save();
    }

    const product = await Product.findById(productId);
    if (!product) return errorResponse(res, "Product not found", 404);

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

    let sale = await Sale.findOne({ user: user._id, ownerId: req.owner._id });

    if (!sale) {
      sale = new Sale({
        user: user._id,
        ownerId: req.owner._id,
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

exports.addService = async (req, res) => {
  const { saleId, productId, serviceTypeId, serviceDate, servicePrice } =
    req.body;

  try {
    const sale = await Sale.findOne({ _id: saleId, ownerId: req.owner._id });
    if (!sale) return errorResponse(res, "Sale not found", 404);

    const productEntry = sale.products.find(
      (p) => p.product.toString() === productId.toString()
    );
    if (!productEntry)
      return errorResponse(res, "Product not found in the sale", 404);

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

exports.getAllSales = async (req, res) => {
  try {
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

exports.getSaleById = async (req, res) => {
  const { id } = req.params;
  try {
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
