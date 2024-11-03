const express = require('express');
const router = express.Router();
const jobOfferController = require('../controllers/jobOfferController');
const authMiddleware = require('../middleware/auth'); // Middleware de autenticación

// Crear una nueva oferta de trabajo
router.post('/create', authMiddleware, jobOfferController.createJobOffer);

// Obtener todas las ofertas de trabajo
router.get('/', jobOfferController.getAllJobOffers);

// Obtener todas las ofertas de trabajo de un cliente específico
router.get('/client/:clientId', authMiddleware, jobOfferController.getJobOffersByClient);

// Obtener una oferta de trabajo por ID
router.get('/:id', jobOfferController.getJobOfferById);

// Actualizar una oferta de trabajo por ID
router.put('/:id/update', authMiddleware, jobOfferController.updateJobOffer);

// Eliminar una oferta de trabajo por ID
router.delete('/:id/delete', authMiddleware, jobOfferController.deleteJobOffer);

module.exports = router;
