const bcrypt = require("bcryptjs");
const Owner = require("../models/owner");
const { successResponse, errorResponse } = require("../utils/responseUtils");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newOwner = new Owner({ email, password: hashedPassword });
    await newOwner.save();

    return successResponse(res, newOwner, "Owner registered successfully");
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const owner = await Owner.findOne({ email });
    if (!owner || !(await bcrypt.compare(password, owner.password))) {
      return errorResponse(res, "Invalid credentials");
    }

    return successResponse(res, owner, "Login successful");
  } catch (err) {
    return errorResponse(res, "Internal server error");
  }
};
