const express = require("express");
const router = express.Router();
const { registerOwner } = require("../controllers/ownerController");
const cors = require("cors");
const corsOptions = require("../constants");

router.use(cors(corsOptions));
router.post("/register", registerOwner);

module.exports = router;
