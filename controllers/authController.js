const Owner = require("../models/owner");
const Technician = require("../models/technician");
const generateToken = require("../utils/generateToken");

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const owner = await Owner.findOne({ email });
  const technician = await Technician.findOne({ email });

  let user = owner || technician;

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

module.exports = { loginUser };
