const express = require("express");
const {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const cors = require("cors");
const corsOptions = require("../constants");

const router = express.Router();

router.use(cors(corsOptions));
router.use(protect);

router.post("/add", restrictTo("owner"), addProduct);
router.get("/",  getAllProducts);
router.get("/:id", restrictTo("owner"), getProductById);
router.put("/:id", restrictTo("owner"), updateProduct);
router.delete("/:id", restrictTo("owner"), deleteProduct);

module.exports = router;
