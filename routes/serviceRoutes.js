const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
  addServiceType,
  getAllServiceTypes,
  getServiceTypeById,
  updateServiceType,
  deleteServiceType,
} = require("../controllers/serviceController");

const corsOptions = {
    origin: ["http://78.142.47.247:7000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

router.use(cors(corsOptions));

router.post("/add", addServiceType);

router.get("/", getAllServiceTypes);

router.get("/:id", getServiceTypeById);

router.put("/:id", updateServiceType);

router.delete("/:id", deleteServiceType);

module.exports = router;
