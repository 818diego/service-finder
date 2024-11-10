const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Proveedor del servicio
  title: { type: String, required: true }, // Título del servicio
  description: { type: String, required: true }, // Descripción del servicio
  price: { type: Number, required: true }, // Precio del servicio
  duration: { type: String, required: true }, // Ej: "1 hora", "3 días"
  category: { type: String, required: true }, // Categoría del servicio
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
