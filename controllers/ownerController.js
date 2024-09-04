const bcrypt = require("bcryptjs");
const Owner = require("../models/owner");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newOwner = new Owner({ email, password: hashedPassword });
    await newOwner.save();
    res.status(201).json({ message: "Owner registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const owner = await Owner.findOne({ email });
    if (!owner || !(await bcrypt.compare(password, owner.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
