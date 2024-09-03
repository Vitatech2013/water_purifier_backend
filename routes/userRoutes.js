const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const cors = require("cors");

const corsOptions = {
  origin: ["http://localhost:5000", "http://localhost:4200"],
};
router.use(cors(corsOptions));

router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router;
