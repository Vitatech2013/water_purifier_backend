const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const cors = require("cors");

const corsOptions = {
  origin: ["http://78.142.47.247:7000"],
};

router.use(cors(corsOptions));
router.use(protect);

router.get("/users", userController.getAllUsers);

router.get("/users/:id", userController.getUserById);

router.post("/users", userController.createUser);

router.put("/users/:id", userController.updateUser);

router.delete("/users/:id", userController.deleteUser);

module.exports = router;
