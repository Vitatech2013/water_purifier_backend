const Technician = require("../models/technician");

// Register a new technician
exports.registerTechnician = async (req, res) => {
  const { name, email, password } = req.body;
  const ownerId = req.owner._id; // The ID of the logged-in owner

  try {
    // Check if a technician with the same email already exists under the same owner
    const existingTechnician = await Technician.findOne({ ownerId, email });

    if (existingTechnician) {
      return res.status(400).json({
        success: false,
        message:
          "Technician with this email already exists under your ownership",
      });
    }

    // Proceed with adding the new technician if not found
    const newTechnician = new Technician({
      name,
      email,
      password,
      ownerId, // Link the technician to the current owner
    });

    // Save the technician
    await newTechnician.save();

    res.status(201).json({
      success: true,
      message: "Technician registered successfully",
      data: newTechnician,
    });
  } catch (error) {
    console.error("Error registering technician:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get all technicians for the logged-in owner
exports.getTechnicians = async (req, res) => {
  try {
    const technicians = await Technician.find({ ownerId: req.owner._id });

    res.status(200).json({
      success: true,
      data: technicians,
    });
  } catch (error) {
    console.error("Error fetching technicians:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Update technician information
exports.updateTechnician = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const technician = await Technician.findById(req.params.id);

    // Check if the technician belongs to the logged-in owner
    if (technician.ownerId.toString() !== req.owner._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this technician",
      });
    }

    technician.name = name || technician.name;
    technician.email = email || technician.email;
    if (password) {
      technician.password = password; // Password should be hashed as per your existing logic
    }

    await technician.save();

    res.status(200).json({
      success: true,
      message: "Technician updated successfully",
      data: technician,
    });
  } catch (error) {
    console.error("Error updating technician:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete a technician
exports.deleteTechnician = async (req, res) => {
  try {
    const technician = await Technician.findById(req.params.id);

    // Check if the technician belongs to the logged-in owner
    if (technician.ownerId.toString() !== req.owner._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this technician",
      });
    }

    await technician.remove();

    res.status(200).json({
      success: true,
      message: "Technician deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting technician:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
