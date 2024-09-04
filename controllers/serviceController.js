const ServiceType = require('../models/service');

// Create a new service type
exports.addServiceType = async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const newServiceType = new ServiceType({ name, description, price });
        await newServiceType.save();
        res.status(201).json(newServiceType);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all service types
exports.getAllServiceTypes = async (req, res) => {
    try {
        const serviceTypes = await ServiceType.find();
        res.status(200).json(serviceTypes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single service type by ID
exports.getServiceTypeById = async (req, res) => {
    try {
        const serviceType = await ServiceType.findById(req.params.id);
        if (!serviceType) return res.status(404).json({ message: 'Service type not found' });
        res.status(200).json(serviceType);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a service type by ID
exports.updateServiceType = async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const updatedServiceType = await ServiceType.findByIdAndUpdate(
            req.params.id,
            { name, description, price },
            { new: true }
        );
        if (!updatedServiceType) return res.status(404).json({ message: 'Service type not found' });
        res.status(200).json(updatedServiceType);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a service type by ID
exports.deleteServiceType = async (req, res) => {
    try {
        const deletedServiceType = await ServiceType.findByIdAndDelete(req.params.id);
        if (!deletedServiceType) return res.status(404).json({ message: 'Service type not found' });
        res.status(200).json({ message: 'Service type deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
