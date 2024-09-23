const Service = require("../models/service");
const { successResponse, errorResponse } = require("../utils/responseUtils");

// Add a new service
exports.addService = async (req, res) => {
  const { serviceName, servicePrice, serviceDescription } = req.body;

  try {
    const newService = new Service({
      serviceName,
      servicePrice,
      serviceDescription,
      ownerId: req.user._id, // Link the service to the logged-in owner
    });

    await newService.save();
    successResponse(res, newService, "Service added successfully", 201);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

// Get all services linked to the owner
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ ownerId: req.user._id });
    if (!services || services.length === 0) {
      return successResponse(res, null, "No services found");
    }
    successResponse(res, services, "Services retrieved successfully");
  } catch (error) {
    errorResponse(res, error.message);
  }
};

// Get a single service by ID (only for the owner)
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findOne({
      _id: req.params.id,
      ownerId: req.user._id,
    });
    if (!service) {
      return successResponse(res, null, "Service not found");
    }
    successResponse(res, service, "Service retrieved successfully");
  } catch (error) {
    errorResponse(res, error.message);
  }
};

// Update a service (only for the owner)
exports.updateService = async (req, res) => {
  const { serviceName, servicePrice, serviceDescription } = req.body;

  try {
    const updatedService = await Service.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user._id },
      { serviceName, servicePrice, serviceDescription },
      { new: true }
    );

    if (!updatedService) {
      return successResponse(res, null, "Service not found or not authorized");
    }

    successResponse(res, updatedService, "Service updated successfully");
  } catch (error) {
    errorResponse(res, error.message);
  }
};

// Mark a service as inactive (only for the owner)
exports.deleteService = async (req, res) => {
  try {
    const updatedService = await Service.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user._id },
      { status: "inactive" }, // Mark as inactive
      { new: true }
    );

    if (!updatedService) {
      return successResponse(res, null, "Service not found or not authorized");
    }

    successResponse(res, updatedService, "Service marked as inactive successfully");
  } catch (error) {
    errorResponse(res, error.message);
  }
};
