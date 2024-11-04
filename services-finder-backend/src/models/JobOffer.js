const mongoose = require('mongoose');

const jobOfferSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  budget: { type: Number },
  status: { type: String, enum: ["Activo", "No disponible"], default: "Activo" },
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('JobOffer', jobOfferSchema);
