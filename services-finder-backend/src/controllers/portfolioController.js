const Portfolio = require('../models/Portfolio');

// Crear un nuevo portafolio
exports.createPortfolio = async (req, res) => {
  try {
    const { title, description, price, duration, category, image } = req.body;
    const provider = req.user.userId; // ID del proveedor autenticado

    const newPortfolio = new Portfolio({
      provider,
      title,
      description,
      price,
      duration,
      category,
      image,
    });

    const savedPortfolio = await newPortfolio.save();
    res.status(201).json(savedPortfolio);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el portafolio', error });
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