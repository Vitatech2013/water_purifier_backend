const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const technicianSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    }, // Link to owner
    role: { type: String, default: "technician" },
  },
  { timestamps: true }
);

// Add a compound index to ensure that the same email can't be used by the same owner
technicianSchema.index({ ownerId: 1, email: 1 }, { unique: true });

technicianSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

technicianSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Technician = mongoose.model("Technician", technicianSchema);
module.exports = Technician;
