const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true }, // Descripción o detalles del trabajo
  images: [{ type: String }], // URLs de imágenes asociadas al post/trabajo
  portfolio: { type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio', required: true }, // Relación con el portafolio
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
