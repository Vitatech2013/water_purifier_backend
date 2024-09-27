const Product = require("../models/product");
const multer = require("multer");
const { successResponse, errorResponse } = require("../utils/responseUtils");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage }).single("file");

exports.addProduct = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return errorResponse(res, "File upload failed");

    const { productName, productPrice, warranty, warrantyType, description } =
      req.body;
    const productImg = req.file ? req.file.filename : null;

    try {
      const newProduct = new Product({
        productName,
        productPrice,
        productImg,
        warranty,
        warrantyType,
        description,
        ownerId: req.user._id,
      });
      await newProduct.save();
      successResponse(res, newProduct, "Product added successfully", 201);
    } catch (error) {
      errorResponse(res, error.message);
    }
  });
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ ownerId: req.user._id });
    if (!products || products.length === 0) {
      return successResponse(res, null, "No products found");
    }
    successResponse(res, products, "Products retrieved successfully");
  } catch (error) {
    errorResponse(res, error.message);
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      ownerId: req.user._id,
    });
    if (!product) {
      return successResponse(res, null, "Product not found");
    }
    successResponse(res, product, "Product retrieved successfully");
  } catch (error) {
    errorResponse(res, error.message);
  }
};

exports.updateProduct = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return errorResponse(res, "File upload failed");

    const { productName, productPrice, warranty, warrantyType, description } =
      req.body;
    const productImg = req.file ? req.file.filename : undefined;

    try {
      const updateData = {
        productName,
        productPrice,
        warranty,
        warrantyType,
        description,
      };
      if (productImg) updateData.productImg = productImg;

      const updatedProduct = await Product.findOneAndUpdate(
        { _id: req.params.id, ownerId: req.user._id },
        updateData,
        { new: true }
      );

      if (!updatedProduct) {
        return successResponse(
          res,
          null,
          "Product not found or not authorized"
        );
      }

      successResponse(res, updatedProduct, "Product updated successfully");
    } catch (error) {
      errorResponse(res, error.message);
    }
  });
};

exports.deleteProduct = async (req, res) => {
  try {
    console.log("Requesting to toggle status for product ID:", req.params.id);

    const product = await Product.findOne({
      _id: req.params.id,
      ownerId: req.user._id,
    });
    console.log("Found product:", product);

    if (!product) {
      return successResponse(res, null, "Product not found or not authorized");
    }

    const newStatus = product.status === "active" ? "inactive" : "active";
    product.status = newStatus;

    await product.save();
    console.log("Updated product status to:", product.status);

    successResponse(
      res,
      product,
      `Product status changed to ${newStatus} successfully`
    );
  } catch (error) {
    console.error("Error toggling product status:", error);
    errorResponse(res, error.message);
  }
};

