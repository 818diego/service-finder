const express = require('express');
const router = express.Router();
const jobOfferController = require('../controllers/jobOfferController');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Crear una nueva oferta de trabajo
router.post('/create', authMiddleware, upload.array('images'), jobOfferController.createJobOffer);

// Obtener todas las ofertas de trabajo
router.get('/all', jobOfferController.getAllJobOffers);

// Obtener todas las ofertas de trabajo de un cliente específico
router.get('/client/:clientId', authMiddleware, jobOfferController.getJobOffersByClient);

// Obtener una oferta de trabajo por ID
router.get('/:jobOfferId', jobOfferController.getJobOfferById);

// Actualizar una oferta de trabajo por ID
router.patch('/:jobOfferId/update', authMiddleware, upload.array('images'), jobOfferController.updateJobOffer);

// Eliminar una oferta de trabajo por ID
router.delete('/:jobOfferId/delete', authMiddleware, jobOfferController.deleteJobOffer);

module.exports = router;
