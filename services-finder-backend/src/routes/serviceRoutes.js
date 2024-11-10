const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const authMiddleware = require('../middleware/auth'); // Middleware de autenticación

// Crear un nuevo servicio en un portafolio específico
router.post('/portfolio/:portfolioId/create', authMiddleware, serviceController.createService);

// Obtener todos los servicios de un portafolio específico
router.get('/portfolio/:portfolioId', authMiddleware, serviceController.getServicesByPortfolio);

// Obtener un servicio por su ID
router.get('/:serviceId', authMiddleware, serviceController.getServiceById);

// Actualizar un servicio por su ID
router.put('/:serviceId/update', authMiddleware, serviceController.updateService);

// Eliminar un servicio por su ID
router.delete('/:serviceId/delete', authMiddleware, serviceController.deleteService);

module.exports = router;
