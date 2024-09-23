const express = require("express");
const router = express.Router();
const { loginUser } = require("../controllers/authController");
const cors = require("cors");

const corsOptions = {
  origin: ["http://78.142.47.247:7002"],
  // origin: ["http://localhost:7000"],
};
router.use(cors(corsOptions));
router.post("/login", loginUser);

module.exports = router;
