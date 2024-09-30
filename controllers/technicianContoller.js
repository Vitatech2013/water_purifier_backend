const Technician = require("../models/technician");

const registerTechnician = async (req, res) => {
  const { name, email, password } = req.body;

  const technicianExists = await Technician.findOne({ email });
  if (technicianExists) {
    return res.status(400).json({ message: "Technician already exists" });
  }

  const technician = await Technician.create({
    name,
    email,
    password,
    ownerId: req.user._id,
  });

  if (technician) {
    res.status(201).json({
      _id: technician._id,
      name: technician.name,
      email: technician.email,
      ownerId: technician.ownerId,
      role: technician.role,
    });
  } else {
    res.status(400).json({ message: "Invalid technician data" });
  }
};

const getTechnicians = async (req, res) => {
  try {
    const technicians = await Technician.find({ ownerId: req.user._id });
    res.status(200).json(technicians);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateTechnician = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    const technician = await Technician.findOne({
      _id: id,
      ownerId: req.user._id,
    });

    if (!technician) {
      return res.status(404).json({ message: "Technician not found" });
    }

    if (name) technician.name = name;
    if (email) technician.email = email;
    if (password) {
      technician.password = password;
    }

    const updatedTechnician = await technician.save();
    res.status(200).json({
      _id: updatedTechnician._id,
      name: updatedTechnician.name,
      email: updatedTechnician.email,
      ownerId: updatedTechnician.ownerId,
      role: updatedTechnician.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteTechnician = async (req, res) => {
  const { id } = req.params;

  try {
    const technician = await Technician.findOneAndDelete({
      _id: id,
      ownerId: req.user._id,
    });

    if (!technician) {
      return res.status(404).json({ message: "Technician not found" });
    }

    res.status(200).json({ message: "Technician removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerTechnician,
  getTechnicians,
  updateTechnician,
  deleteTechnician,
};
