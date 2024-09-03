const Product = require('../models/product');
const upload = require('../config/multer');



exports.addProduct = (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: "File upload failed" });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const data = {
        productName: req.body.productName,
        productPrice: req.body.productPrice,
        productImg: req.file.filename, 
        warranty: req.body.warranty,
        description: req.body.description || ''
      };

      const newProduct = new Product(data);
      await newProduct.save();
      return res.status(200).json(newProduct);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
};

// Update a product
exports.updateProduct = (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: "File upload failed" });
    }

    try {
      const updateData = {
        productName: req.body.productName,
        productPrice: req.body.productPrice,
        warranty: req.body.warranty,
        description: req.body.description || ''
      };

      if (req.file) {
        updateData.productImg = req.file.filename; // Save the new filename
      }

      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
      if (!updatedProduct) return res.status(404).json({ error: "Product not found" });

      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update product" });
    }
  });
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ error: "Product not found" });

    // Optionally, remove the file from the file system if needed
    // const filePath = path.join(__dirname, '../uploads/', deletedProduct.productImg);
    // fs.unlink(filePath, err => {
    //   if (err) console.error('Error removing file:', err);
    // });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get products" });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get product" });
  }
};
