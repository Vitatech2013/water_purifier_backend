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
    // Check if the user is an owner or a technician
    let query = {};

    if (req.user.role === 'owner') {
      // If the user is an owner, return services for that owner
      query.ownerId = req.user._id; // Assuming req.user contains the owner's ID
    } else if (req.user.role === 'technician') {
      // If the user is a technician, return services that the technician can work on
      // For now, let's assume it's services related to the technician's owner
      query.ownerId = req.user.ownerId; // Assuming technician has an ownerId field
    }

    // Fetch services based on the query
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
    const updatedService = await Service.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user._id },
      { status: "inactive" },
      { new: true }
    );

    if (!updatedService) {
      return successResponse(res, null, "Service not found or not authorized");
    }

    successResponse(
      res,
      updatedService,
      "Service marked as inactive successfully"
    );
  } catch (error) {
    errorResponse(res, error.message);
  }
};
