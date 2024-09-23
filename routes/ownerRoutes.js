const express = require("express");
const router = express.Router();
const { registerOwner } = require("../controllers/ownerController");

router.post("/register", registerOwner);

module.exports = router;
