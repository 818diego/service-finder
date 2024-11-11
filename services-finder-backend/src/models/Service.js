const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true }, // Descripción o detalles del trabajo
  price: { type: Number, required: true }, // Precio total del servicio
  images: {
    type: [{ type: String }],
    validate: {
      validator: function(images) {
        // Verifica que haya al menos una imagen
        return images && images.length > 0;
      },
      message: 'Al menos una imagen es requerida',
    },
  },
  portfolio: { type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio', required: true }, // Relación con el portafolio
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
