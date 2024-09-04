const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const ownerRoutes = require("./routes/ownerRoutes");
const productRoutes = require("./routes/productRoutes");
const saleRoutes = require("./routes/saleRoutes");
const serviceTypeRoutes = require("./routes/serviceRoutes");

dotenv.config();
connectDB();

const app = express();

const corsOptions = {
  origin: ["http://localhost:5000", "http://localhost:4200"],
  // methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  // credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/owner", ownerRoutes);
app.use("/api/product", productRoutes);
app.use("/api/sale", saleRoutes);
app.use("/api/service", serviceTypeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
