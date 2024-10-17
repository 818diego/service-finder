const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true }, // El servicio al que pertenece este portafolio
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }] // Lista de posts o trabajos
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
