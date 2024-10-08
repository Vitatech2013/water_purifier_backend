const Service = require("../models/service");
const { successResponse, errorResponse } = require("../utils/responseUtils");

exports.addService = async (req, res) => {
  const { serviceName, servicePrice, serviceDescription } = req.body;

  try {
    const newService = new Service({
      serviceName,
      servicePrice,
      serviceDescription,
      ownerId: req.user._id,
    });

    await newService.save();
    successResponse(res, newService, "Service added successfully", 201);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

exports.getAllServices = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "owner") {
      query.ownerId = req.user._id;
    } else if (req.user.role === "technician") {
      query.ownerId = req.user.ownerId; // Assuming technician has an ownerId field
    }

    const services = await Service.find(query);

    if (!services || services.length === 0) {
      return successResponse(res, null, "No services found");
    }

    successResponse(res, services, "Services retrieved successfully");
  } catch (error) {
    errorResponse(res, error.message);
  }
};

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

exports.deleteService = async (req, res) => {
  try {
    // Find the service by ID and ownerId
    const service = await Service.findOne({
      _id: req.params.id,
      ownerId: req.user._id,
    });

    // If service not found or not authorized
    if (!service) {
      return successResponse(res, null, "Service not found or not authorized");
    }

    // Toggle the service status between "active" and "inactive"
    const newStatus = service.status === "active" ? "inactive" : "active";
    service.status = newStatus;

    // Save the updated service status
    await service.save();

    // Send success response
    successResponse(res, service, `Service status changed to ${newStatus} successfully`);
  } catch (error) {
    // Handle any errors and send an error response
    errorResponse(res, error.message);
  }
};

