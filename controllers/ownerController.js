const Owner = require("../models/owner");
const generateToken = require("../utils/generateToken");

const registerOwner = async (req, res) => {
  const { name, email, password } = req.body;

  const ownerExists = await Owner.findOne({ email });
  if (ownerExists) {
    return res.status(400).json({ message: "Owner already exists" });
  }

  const owner = await Owner.create({ name, email, password });

  if (owner) {
    res.status(201).json({
      _id: owner._id,
      name: owner.name,
      email: owner.email,
      password: owner.password,
      token: generateToken(owner._id),
    });
  } else {
    res.status(400).json({ message: "Invalid owner data" });
  }
};

const loginOwner = async (req, res) => {
  const { email, password } = req.body;

  const owner = await Owner.findOne({ email });

  if (owner && (await owner.matchPassword(password))) {
    res.json({
      _id: owner._id,
      name: owner.name,
      email: owner.email,
      token: generateToken(owner._id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

module.exports = { registerOwner, loginOwner };
