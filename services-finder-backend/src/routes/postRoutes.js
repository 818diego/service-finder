const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/auth'); // Asegúrate de usar autenticación si es necesario

// Ruta para agregar posts existentes a un portfolio específico
router.put('/portfolio/:portfolioId/add-posts', authMiddleware, postController.addPostsToPortfolio);

// Ruta para crear un nuevo post en un portfolio específico
router.post('/portfolio/:portfolioId/create-post', authMiddleware, postController.createPost);

// Ruta para obtener todos los posts de un portfolio específico
router.get('/portfolio/:portfolioId/posts', authMiddleware, postController.getPostsByPortfolio);

// Ruta para obtener un post específico por su ID
router.get('/post/:postId', authMiddleware, postController.getPostById);

// Ruta para actualizar un post específico por su ID
router.put('/post/:postId/update', authMiddleware, postController.updatePost);

// Ruta para eliminar un post específico por su ID
router.delete('/post/:postId/delete', authMiddleware, postController.deletePost);

module.exports = router;
