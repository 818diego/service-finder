const express = require('express');
const router = express.Router();
const {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService
} = require('../controllers/serviceController');
const auth = require('../middleware/auth');

// Ruta para crear un servicio (solo para proveedores autenticados)
router.post('/services/create', auth, createService);

// Ruta para obtener todos los servicios
router.get('/services/list', getAllServices);

// Ruta para obtener un servicio por ID
router.get('/services/view/:id', getServiceById);

// Ruta para actualizar un servicio
router.put('/services/update/:id', auth, updateService);

// Ruta para eliminar un servicio
router.delete('/services/delete/:id', auth, deleteService);

module.exports = router;
