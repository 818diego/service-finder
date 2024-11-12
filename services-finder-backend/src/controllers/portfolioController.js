const Portfolio = require('../models/Portfolio');
const cloudinary = require('../../cloudinaryConfig');
const User = require('../models/User');
const mongoose = require('mongoose');


exports.createPortfolio = async (req, res) => {
  try {
    const { title, description, price, duration, category } = req.body;
    const provider = req.user.userId; // ID del proveedor autenticado

    // Verificar si hay un archivo de imagen en la solicitud
    if (!req.file) {
      return res.status(400).json({ message: 'La imagen es requerida' });
    }

    // Subir la imagen a Cloudinary usando el buffer
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'portfolio-images' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer); // Enviar el buffer a Cloudinary
    });

    // Crear el portafolio con la URL de la imagen en Cloudinary
    const newPortfolio = new Portfolio({
      provider,
      title,
      description,
      price,
      duration,
      category,
      image: result.secure_url, // URL de la imagen en Cloudinary
    });

    const savedPortfolio = await newPortfolio.save();

    await User.findByIdAndUpdate(provider, { $push: { portfolios: savedPortfolio._id } });

    res.status(201).json(savedPortfolio);
  } catch (error) {
    console.error('Error al crear el portafolio:', error);
    res.status(500).json({ message: 'Error al crear el portafolio', error: error.message });
  }
};

// Obtener todos los portafolios
exports.getAllPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find().populate('provider');
    res.status(200).json(portfolios);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los portafolios', error });
  }
};

// Obtener un portafolio por ID
exports.getPortfolioById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id).populate('provider');
    if (!portfolio) return res.status(404).json({ message: 'Portafolio no encontrado' });
    res.status(200).json(portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el portafolio', error });
  }
};

exports.updatePortfolioById = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Si hay un archivo de imagen en la solicitud, sube la imagen a Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload_stream(
        { folder: 'portfolio-images' },
        (error, result) => {
          if (error) {
            return res.status(500).json({ message: 'Error al subir la imagen a Cloudinary', error: error.message });
          }
          updates.image = result.secure_url; // Actualiza el campo de imagen con la nueva URL

          // Actualiza el portafolio con los datos de `updates`, incluyendo la nueva imagen si está presente
          Portfolio.findByIdAndUpdate(id, updates, { new: true })
            .then(updatedPortfolio => {
              if (!updatedPortfolio) {
                return res.status(404).json({ message: 'Portafolio no encontrado' });
              }
              res.status(200).json(updatedPortfolio);
            })
            .catch(err => {
              console.error("Error al actualizar el portafolio:", err);
              res.status(500).json({ message: 'Error al actualizar el portafolio', error: err.message });
            });
        }
      );
      // Envía el buffer de la imagen a Cloudinary
      result.end(req.file.buffer);
    } else {
      // Si no hay imagen, actualiza solo los otros campos
      const updatedPortfolio = await Portfolio.findByIdAndUpdate(id, updates, { new: true });
      
      if (!updatedPortfolio) {
        return res.status(404).json({ message: 'Portafolio no encontrado' });
      }

      res.status(200).json(updatedPortfolio);
    }
  } catch (error) {
    console.error("Error al actualizar el portafolio:", error);
    res.status(500).json({ message: 'Error al actualizar el portafolio', error: error.message });
  }
};

// Eliminar un portafolio por ID
exports.deletePortfolio = async (req, res) => {
  try {
    const deletedPortfolio = await Portfolio.findByIdAndDelete(req.params.id);
    if (!deletedPortfolio) return res.status(404).json({ message: 'Portafolio no encontrado' });
    res.status(200).json({ message: 'Portafolio eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el portafolio', error });
  }
};

// Obtener todos los portafolios de un proveedor específico (por ID de proveedor)
exports.getAllPortfoliosByProviderId = async (req, res) => {
  try {
    const { providerId } = req.params;
    const portfolios = await Portfolio.find({ provider: providerId }).populate('provider');
    res.status(200).json(portfolios);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los portafolios del proveedor', error });
  }
};