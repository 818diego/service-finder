const Portfolio = require('../models/Portfolio');
const Service = require('../models/Service');

// Crear un portfolio sin posts
const createPortfolio = async (req, res) => {
    try {
      const { serviceId } = req.body;
  
      // Verificar que el servicio exista
      const service = await Service.findById(serviceId);
      if (!service) {
        return res.status(404).json({ message: 'Servicio no encontrado' });
      }
  
      // Crear el portfolio sin posts
      const newPortfolio = new Portfolio({
        service: serviceId,
        posts: [] // Inicialmente vacío
      });
  
      // Guardar el portfolio en la base de datos
      const savedPortfolio = await newPortfolio.save();
  
      // Asociar el portfolio al servicio
      service.portfolio = savedPortfolio._id;
      await service.save();
  
      res.status(201).json(savedPortfolio);
    } catch (error) {
      console.error("Error al crear el portfolio:", error);
      res.status(500).json({ message: 'Error al crear el portfolio' });
    }
  };
// Obtener todos los portfolios
const getAllPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find().populate('service').populate('posts');
    res.status(200).json(portfolios);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los portfolios' });
  }
};

// Obtener un portfolio por ID
const getPortfolioById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id).populate('service').populate('posts');
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio no encontrado' });
    }
    res.status(200).json(portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el portfolio' });
  }
};

// Actualizar un portfolio
const updatePortfolio = async (req, res) => {
  try {
    const { posts } = req.body;
    const updatedPortfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      { posts },
      { new: true }
    ).populate('service').populate('posts');

    if (!updatedPortfolio) {
      return res.status(404).json({ message: 'Portfolio no encontrado' });
    }
    res.status(200).json(updatedPortfolio);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el portfolio' });
  }
};

// Eliminar un portfolio
const deletePortfolio = async (req, res) => {
  try {
    const deletedPortfolio = await Portfolio.findByIdAndDelete(req.params.id);
    if (!deletedPortfolio) {
      return res.status(404).json({ message: 'Portfolio no encontrado' });
    }

    // Eliminar la referencia del servicio al portfolio
    await Service.findByIdAndUpdate(deletedPortfolio.service, { $unset: { portfolio: "" } });

    res.status(200).json({ message: 'Portfolio eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el portfolio' });
  }
};

module.exports = {
  createPortfolio,
  getAllPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio
};
