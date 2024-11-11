const Portfolio = require('../models/Portfolio');
const cloudinary = require('../../cloudinaryConfig');


exports.createPortfolio = async (req, res) => {
  try {
    const { title, description, price, duration, category } = req.body;
    const provider = req.user.userId; // ID del proveedor autenticado
    // Verifica que cloudinary esté configurado
    if (!cloudinary.uploader || typeof cloudinary.uploader.upload !== 'function') {
      console.error('Cloudinary no está configurado correctamente.');
    }
    // Verificar si req.file existe
    if (!req.file) {
      return res.status(400).json({ message: 'La imagen es requerida' });
    }

    // Subir la imagen a Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'portfolio-images', // Carpeta en Cloudinary
    });

    if (!result.secure_url) {
      return res.status(500).json({ message: 'Error al subir la imagen a Cloudinary' });
    }

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
    res.status(201).json(savedPortfolio);
  } catch (error) {
    console.error('Error al crear el portafolio:', error); // Muestra el error en la consola
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


// Actualizar parcialmente un portafolio específico por su ID
exports.updatePortfolioById = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // Obtenemos solo los campos que se enviaron en el body

    const updatedPortfolio = await Portfolio.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedPortfolio) return res.status(404).json({ message: 'Portafolio no encontrado' });
    
    res.status(200).json(updatedPortfolio);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el portafolio', error });
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