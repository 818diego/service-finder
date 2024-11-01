const express = require('express');
const router = express.Router();
const {
  getAllPortfolios,
  getPortfoliosByUserId,
  getPortfolioById,
  deletePortfolio
} = require('../controllers/portfolioController');
const auth = require('../middleware/auth');

// Ruta para obtener todos los portfolios
router.get('/portfolios/list', getAllPortfolios);

// Ruta para obtener portfolios de un usuario específico
router.get('/portfolios/user/:userId', getPortfoliosByUserId);

// Ruta para obtener un portfolio por ID
router.get('/portfolios/view/:id', getPortfolioById);

// Ruta para eliminar un portfolio
router.delete('/portfolios/delete/:id', auth, deletePortfolio);

module.exports = router;
