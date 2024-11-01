const Portfolio = require('../models/Portfolio');
const Service = require('../models/Service');

// Obtener todos los portfolios
const getAllPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find().populate('service').populate('posts');
    res.status(200).json(portfolios);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los portfolios' });
  }
};

// Obtener portfolios de un usuario específico
const getPortfoliosByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    // Encuentra todos los servicios asociados al usuario
    const services = await Service.find({ provider: userId }).select('portfolio');
    const portfolioIds = services.map(service => service.portfolio).filter(Boolean); // Filtra los nulos

    // Encuentra los portfolios que coinciden con esos IDs
    const portfolios = await Portfolio.find({ _id: { $in: portfolioIds } })
      .populate('service')
      .populate('posts');

    res.status(200).json(portfolios);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los portfolios del usuario' });
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
  getAllPortfolios,
  getPortfoliosByUserId,
  getPortfolioById,
  deletePortfolio
};
