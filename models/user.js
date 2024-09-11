const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
