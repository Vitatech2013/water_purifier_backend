const express = require("express");
const {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
const cors = require("cors");
const corsOptions = {
  origin: ["http://78.142.47.247:7000"],
};

router.use(cors(corsOptions));
router.use(protect);

router.post("/add", addProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
