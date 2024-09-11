const User = require("../models/user");
const { successResponse, errorResponse } = require("../utils/responseUtils");

exports.createUser = async (req, res) => {
  try {
    const user = new User({ ...req.body, ownerId: req.owner._id });
    await user.save();
    successResponse(res, user, "User created successfully", 201);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ ownerId: req.owner._id });
    successResponse(res, users, "Users fetched successfully");
  } catch (err) {
    errorResponse(res, err.message);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      ownerId: req.owner._id,
    });
    if (!user) return successResponse(res, null, "User not found", 404);
    successResponse(res, user, "User fetched successfully");
  } catch (err) {
    errorResponse(res, err.message);
  }
};

exports.updateUser = async (req, res) => {
  try {
    console.log("Update Request Body:", req.body);
    console.log("User ID:", req.params.id);
    console.log("Owner ID:", req.owner._id);
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.owner._id },
      req.body,
      { new: true }
    );
    if (!user) return successResponse(res, null, "User not found", 404);
    successResponse(res, user, "User updated successfully");
  } catch (err) {
    errorResponse(res, err.message);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({
      _id: req.params.id,
      ownerId: req.owner._id,
    });
    if (!user) return successResponse(res, null, "User not found", 404);
    successResponse(res, null, "User deleted successfully");
  } catch (err) {
    errorResponse(res, err.message);
  }
};
