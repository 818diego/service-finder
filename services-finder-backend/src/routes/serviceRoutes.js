const express = require('express');
const router = express.Router();
const {
  createService,
  getAllServices,
  getServiceById,
  getServicesByUserId,
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

// Ruta para obtener todos los servicios de un usuario específico por su ID
router.get('/services/user/:userId/services', auth, getServicesByUserId);

// Ruta para actualizar un servicio
router.patch('/services/update/:id', auth, updateService);

// Ruta para eliminar un servicio
router.delete('/services/delete/:id', auth, deleteService);

module.exports = router;
