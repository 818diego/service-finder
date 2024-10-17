const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Proveedor del servicio
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true }, // Ej: "1 hora", "3 días"
  category: { type: String, required: true },
  portfolio: { type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio' } // Relación con el portafolio del servicio
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
