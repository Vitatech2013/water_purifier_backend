const Product = require('../models/product');
const multer = require('multer');
const path = require('path');

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage }).single('file');

// Add a new product
exports.addProduct = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) return res.status(500).json({ error: 'File upload failed' });

        const { productName, productPrice, warranty, description } = req.body;
        const productImg = req.file.filename;

        try {
            const newProduct = new Product({ productName, productPrice, productImg, warranty, description });
            await newProduct.save();
            res.status(201).json(newProduct);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a product
exports.updateProduct = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) return res.status(500).json({ error: 'File upload failed' });

        const { productName, productPrice, warranty, description } = req.body;
        const productImg = req.file ? req.file.filename : undefined;

        try {
            const updateData = { productName, productPrice, warranty, description };
            if (productImg) updateData.productImg = productImg;

            const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
            if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });

            res.status(200).json(updatedProduct);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ error: 'Product not found' });
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
