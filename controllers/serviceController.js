const ServiceType = require("../models/service");
const { successResponse, errorResponse } = require("../utils/responseUtils");

exports.addServiceType = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const newServiceType = new ServiceType({ name, description, price });
    await newServiceType.save();
    successResponse(
      res,
      newServiceType,
      "Service type added successfully",
      201
    );
  } catch (error) {
    errorResponse(res, error.message);
  }
};

exports.getAllServiceTypes = async (req, res) => {
  try {
    const serviceTypes = await ServiceType.find();
    if (!serviceTypes || serviceTypes.length === 0) {
      return successResponse(res, null, "No service types found");
    }
    successResponse(res, serviceTypes, "Service types retrieved successfully");
  } catch (error) {
    errorResponse(res, error.message);
  }
};

exports.getServiceTypeById = async (req, res) => {
  try {
    const serviceType = await ServiceType.findById(req.params.id);
    if (!serviceType) {
      return successResponse(res, null, "Service type not found");
    }
    successResponse(res, serviceType, "Service type retrieved successfully");
  } catch (error) {
    errorResponse(res, error.message);
  }
};

exports.updateServiceType = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const updatedServiceType = await ServiceType.findByIdAndUpdate(
      req.params.id,
      { name, description, price },
      { new: true }
    );
    if (!updatedServiceType) {
      return successResponse(res, null, "Service type not found");
    }
    successResponse(
      res,
      updatedServiceType,
      "Service type updated successfully"
    );
  } catch (error) {
    errorResponse(res, error.message);
  }
};

exports.deleteServiceType = async (req, res) => {
  try {
    const deletedServiceType = await ServiceType.findByIdAndDelete(
      req.params.id
    );
    if (!deletedServiceType) {
      return successResponse(res, null, "Service type not found");
    }
    successResponse(
      res,
      deletedServiceType,
      "Service type deleted successfully"
    );
  } catch (error) {
    errorResponse(res, error.message);
  }
};
