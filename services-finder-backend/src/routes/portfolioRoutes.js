const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');

// Configuración de multer para almacenar en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });


// Crear un nuevo portafolio
router.post('/create', authMiddleware, upload.single('image'), portfolioController.createPortfolio);

// Obtener todos los portafolios
router.get('/list', authMiddleware, portfolioController.getAllPortfolios);

// Obtener todos los portafolios de un proveedor específico
router.get('/provider/:providerId', authMiddleware, portfolioController.getAllPortfoliosByProviderId);

// Obtener un portafolio por su ID
router.get('/:id', authMiddleware, portfolioController.getPortfolioById);

// Actualizar un portafolio por su ID
router.patch('/:id/update', authMiddleware, upload.single('image'), portfolioController.updatePortfolioById);

// Eliminar un portafolio por su ID
router.delete('/:id/delete', authMiddleware, portfolioController.deletePortfolio);

module.exports = router;
