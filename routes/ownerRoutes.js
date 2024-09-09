const express = require("express");

const { register, login } = require("../controllers/ownerController");
const router = express.Router();
const cors = require("cors");
const corsOptions = {
  origin: ["http://78.142.47.247:7000"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
router.use(cors(corsOptions));

router.post("/register", register);
router.post("/login", login);

module.exports = router;
