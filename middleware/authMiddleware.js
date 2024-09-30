const jwt = require("jsonwebtoken");
const Owner = require("../models/owner");
const Technician = require("../models/technician");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log("Decoded Token ID:", decoded.id);

      const owner = await Owner.findById(decoded.id).select("-password");
      const technician = await Technician.findById(decoded.id).select(
        "-password"
      );

      console.log("Fetched Owner:", owner);
      console.log("Fetched Technician:", technician);

      if (owner) {
        req.owner = owner;
        req.user = owner;
        req.role = "owner";
        console.log("User role: Owner");
      } else if (technician) {
        req.technician = technician;
        req.user = technician;
        req.role = "technician";
        console.log("User role: Technician");
      }

      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }

      next();
    } catch (error) {
      console.error("Token verification failed:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.role)) {
      return res
        .status(403)
        .json({ message: "Access denied: Insufficient permissions" });
    }
    next();
  };
};

module.exports = { protect, restrictTo };
