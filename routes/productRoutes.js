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

const router = express.Router();
const corsOptions = {
  origin: ["http://78.142.47.247:7002"],
  // origin: ["http://localhost:7000"],
  // origin: ["http://localhost:7000"],
};
router.use(cors(corsOptions));
router.use(protect);

router.post("/add", restrictTo("owner"), addProduct);
router.get("/", restrictTo("owner"), getAllProducts);
router.get("/:id", restrictTo("owner"), getProductById);
router.put("/:id", restrictTo("owner"), updateProduct);
router.delete("/:id", restrictTo("owner"), deleteProduct);

module.exports = router;
