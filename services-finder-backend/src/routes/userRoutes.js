const express = require('express');
const router = express.Router();
const usersController = require('../controllers/userController');

// Ruta para obtener un usuario por su ID
router.get('/:userId', usersController.getUserById);

module.exports = router;
