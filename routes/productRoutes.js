const express = require("express");
const {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();
const cors = require("cors");
const corsOptions = {
  origin: ["http://78.142.47.247:7000"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
router.use(cors(corsOptions));
router.post("/add", addProduct);

router.get("/", getAllProducts);

router.get("/:id", getProductById);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

module.exports = router;
