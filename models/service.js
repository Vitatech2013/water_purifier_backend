const mongoose = require('mongoose');

const serviceTypeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('ServiceType', serviceTypeSchema);
