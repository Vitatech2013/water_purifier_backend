const Sale = require("../models/sale");
const Product = require("../models/product");
const User = require("../models/user");
const { successResponse, errorResponse } = require("../utils/responseUtils");
exports.addSale = async (req, res) => {
  const { name, mobile, productId, saleDate } = req.body;

  try {
    let user = await User.findOne({ mobile });

    if (!user) {
      user = new User({
        name,
        mobile,
      });
      await user.save();
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const warrantyExpiry = new Date(saleDate);
    warrantyExpiry.setFullYear(
      warrantyExpiry.getFullYear() + parseInt(product.warranty)
    );

    let sale = await Sale.findOne({ user: user._id });

    if (!sale) {
      sale = new Sale({
        user: user._id,
        products: [{ product: product._id, saleDate, warrantyExpiry }],
      });
    } else {
      const existingProduct = sale.products.find(
        (p) => p.product.toString() === product._id.toString()
      );

      if (!existingProduct) {
        sale.products.push({ product: product._id, saleDate, warrantyExpiry });
      } else {
        existingProduct.saleDate = saleDate;
        existingProduct.warrantyExpiry = warrantyExpiry;
      }
    }

    await sale.save();

    res.status(201).json(sale);
    successResponse(res, sale);
  } catch (err) {
    res.status(500).json({ error: err.message });
    errorResponse(res, err.message);
  }
};

exports.addService = async (req, res) => {
  const { saleId, productId, serviceTypeId, serviceDate, servicePrice } =
    req.body;

  try {
    const sale = await Sale.findById(saleId);
    if (!sale) return res.status(404).json({ error: "Sale not found" });

    const productEntry = sale.products.find(
      (p) => p.product.toString() === productId.toString()
    );
    if (!productEntry)
      return res.status(404).json({ error: "Product not found in the sale" });

    productEntry.services.push({
      serviceType: serviceTypeId,
      serviceDate,
      servicePrice,
    });

    await sale.save();

    res.status(201).json(sale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate("user")
      .populate("products.product")
      .populate("products.services.serviceType");
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSaleById = async (req, res) => {
  const { id } = req.params;
  try {
    const sale = await Sale.findById(id)
      .populate("user")
      .populate("products.product")
      .populate("products.services.serviceType");
    if (!sale) return res.status(404).json({ error: "Sale not found" });
    res.json(sale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
