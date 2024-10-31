const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/auth'); // Asegúrate de usar autenticación si es necesario

// Ruta para agregar posts existentes a un portfolio específico
router.put('/post/portfolio/:portfolioId/add-create-posts', authMiddleware, postController.createPost);
// En la ruta hay que poner el id del portfolio al que se le quiere agregar el post

// Ruta para obtener todos los posts de un portfolio específico
router.get('/post/portfolio/:portfolioId/posts', authMiddleware, postController.getPostsByPortfolio);

// Ruta para obtener un post específico por su ID
router.get('/post/:postId', authMiddleware, postController.getPostById);
// En la ruta hay que poner en :postId el id del post que se quiere obtener

// Ruta para actualizar un post específico por su ID
router.put('/post/:postId/update', authMiddleware, postController.updatePost);

// Ruta para eliminar un post específico por su ID
router.delete('/post/:postId/delete', authMiddleware, postController.deletePost);

module.exports = router;
