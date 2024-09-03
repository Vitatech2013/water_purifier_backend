const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("dotenv").config();
connectDB();

const userRoute = require("./routes/userRoutes");
const productRoute = require("./routes/productRoutes");
const serviceRoute = require("./routes/serviceRoutes");
const salesRoute = require("./routes/saleRoutes");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/service", serviceRoute);
app.use("/api/sale", salesRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
