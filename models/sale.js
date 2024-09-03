const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    saleDate: { type: Date, required: true },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        warrantyPeriod: { type: Number, required: true },
        expiryDate: { type: Date, required: true },
      },
    ],
    customerName: { type: String, required: true },
    Mobile: { type: String, required: true },
    Address: { type: String, required: true },
  },
  { timestamps: true }
);

saleSchema.pre("save", function (next) {
  this.products.forEach((product) => {
    product.expiryDate = new Date(
      this.saleDate.getFullYear(),
      this.saleDate.getMonth() + product.warrantyPeriod,
      this.saleDate.getDate()
    );
  });
  next();
});

module.exports = mongoose.model("Sale", saleSchema);
