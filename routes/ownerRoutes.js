const express = require("express");
const router = express.Router();
const { registerOwner } = require("../controllers/ownerController");
const cors = require("cors");

const corsOptions = {
  origin: ["http://78.142.47.247:7002"],
  // origin: ["http://localhost:7000"],
};
router.use(cors(corsOptions));
router.post("/register", registerOwner);

module.exports = router;
