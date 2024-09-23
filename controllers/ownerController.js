const Owner = require("../models/owner");
const generateToken = require("../utils/generateToken");

const registerOwner = async (req, res) => {
  const { name, email, password } = req.body;

  const ownerExists = await Owner.findOne({ email });
  if (ownerExists) {
    return res.status(400).json({ message: "Owner already exists" });
  }

  const owner = await Owner.create({
    name,
    email,
    password,
  });

  if (owner) {
    res.status(201).json({
      _id: owner._id,
      name: owner.name,
      email: owner.email,
      role: owner.role,
      token: generateToken(owner._id, owner.role),
    });
  } else {
    res.status(400).json({ message: "Invalid owner data" });
  }
};

module.exports = { registerOwner };
