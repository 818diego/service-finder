const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  jobOffer: { type: mongoose.Schema.Types.ObjectId, ref: 'JobOffer', required: true }, // ID de la oferta de trabajo
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Proveedor que envía la propuesta
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Cliente que recibe la propuesta
  message: { type: String, required: true }, // Mensaje con la propuesta del proveedor
  price: { type: Number, required: true }, // Precio propuesto por el proveedor
  estimatedTime: { type: String, required: true }, // Tiempo estimado para completar el trabajo
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }, // Estado de la propuesta
}, { timestamps: true });

module.exports = mongoose.model('Proposal', proposalSchema);
