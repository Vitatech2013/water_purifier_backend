const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

const cors = require("cors");

const corsOptions = {
  origin: ["http://localhost:5000", "http://localhost:4200"],
};
router.use(cors(corsOptions));

router.get("/products", productController.getAllProducts);
router.post("/addproduct", productController.addProduct);
router.get("/getproduct/:id", productController.getProductById);
router.put("/updateproduct/:id", productController.updateProduct);
router.delete("/deleteproduct/:id", productController.deleteProduct);

module.exports = router;
