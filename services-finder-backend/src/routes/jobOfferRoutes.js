const express = require('express');
const router = express.Router();
const jobOfferController = require('../controllers/jobOfferController');
const authMiddleware = require('../middleware/auth'); // Middleware de autenticación

// Crear una nueva oferta de trabajo
router.post('/job-offers/create', authMiddleware, jobOfferController.createJobOffer);

// Obtener todas las ofertas de trabajo
router.get('/job-offers/all', jobOfferController.getAllJobOffers);

// Obtener todas las ofertas de trabajo de un cliente específico
router.get('/job-offers/client/:clientId', authMiddleware, jobOfferController.getJobOffersByClient);

// Obtener una oferta de trabajo por ID
router.get('/job-offers/:jobOfferId', jobOfferController.getJobOfferById);

// Actualizar una oferta de trabajo por ID
router.put('/job-offers/:jobOfferId/update', authMiddleware, jobOfferController.updateJobOffer);

// Eliminar una oferta de trabajo por ID
router.delete('/job-offers/:jobOfferId/delete', authMiddleware, jobOfferController.deleteJobOffer);

module.exports = router;
