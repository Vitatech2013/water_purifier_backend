const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");

const cors = require("cors");

const corsOptions = {
  origin: ["http://localhost:5000", "http://localhost:4200"],
};
router.use(cors(corsOptions));

router.get("/services", serviceController.getAllServices);
router.post("/addservice", serviceController.addService);
router.put("/updateservice/:id", serviceController.updateService);
router.delete("/deleteservice/:id", serviceController.deleteService);

module.exports = router;
