const express = require('express');
const router = express.Router();
const cors = require('cors');
const {
    addServiceType,
    getAllServiceTypes,
    getServiceTypeById,
    updateServiceType,
    deleteServiceType
} = require('../controllers/serviceController');

const corsOptions = {
    origin: ["http://localhost:5000", "http://localhost:4200"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
};

router.use(cors(corsOptions));

// Create a new service type
router.post('/add', addServiceType);

// Get all service types
router.get('/', getAllServiceTypes);

// Get a single service type by ID
router.get('/:id', getServiceTypeById);

// Update a service type by ID
router.put('/:id', updateServiceType);

// Delete a service type by ID
router.delete('/:id', deleteServiceType);

module.exports = router;
