const mongoose = require('mongoose');

const jobOfferSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Cliente que crea la oferta
  title: { type: String, required: true },
  description: { type: String, required: true }, // Descripción del trabajo solicitado
  category: { type: String, required: true }, // Categoría del trabajo
  budget: { type: Number }, // Presupuesto máximo del cliente
  status: { type: String, enum: ['open', 'closed'], default: 'open' }, // Estado de la oferta de trabajo
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('JobOffer', jobOfferSchema);
