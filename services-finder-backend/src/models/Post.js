const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  portfolio: { type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio', required: true }, // Relación con el portafolio
  title: { type: String, required: true },
  description: { type: String, required: true }, // Descripción o detalles del trabajo
  images: [{ type: String }], // URLs de imágenes asociadas al post/trabajo
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
