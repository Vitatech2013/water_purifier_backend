const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    productPrice: { type: Number, required: true },
    productImg: { type: String, required: true },
    warranty: { type: Number, required: true },
    warrantyType: { type: String, enum: ["months", "years"], required: true },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
