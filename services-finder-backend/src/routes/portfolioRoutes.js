const express = require('express');
const router = express.Router();
const {
  createPortfolio,
  getAllPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio
} = require('../controllers/portfolioController');
const auth = require('../middleware/auth');

// Ruta para crear un portfolio
router.post('/portfolios/create', auth, createPortfolio);

// Ruta para obtener todos los portfolios
router.get('/portfolios/list', getAllPortfolios);

// Ruta para obtener un portfolio por ID
router.get('/portfolios/view/:id', getPortfolioById);

// Ruta para actualizar un portfolio
router.put('/portfolios/update/:id', auth, updatePortfolio);

// Ruta para eliminar un portfolio
router.delete('/portfolios/delete/:id', auth, deletePortfolio);

module.exports = router;
