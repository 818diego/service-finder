const Post = require('../models/Post');
const Portfolio = require('../models/Portfolio');

// Crear un nuevo post asociado a un portafolio
exports.createPost = async (req, res) => {
  try {
    const { portfolioId } = req.params; // Obtenemos el ID del portafolio desde la URL
    const { title, description, images } = req.body;
    const newPost = new Post({ portfolio: portfolioId, title, description, images });
    const savedPost = await newPost.save();

    // Actualizar el portafolio para incluir el nuevo post
    const portfolio = await Portfolio.findById(portfolioId);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portafolio no encontrado' });
    }
    portfolio.posts.push(savedPost._id);
    await portfolio.save();

    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear el post', error: err });
  }
};

// Obtener todos los posts de un portafolio específico
exports.getPostsByPortfolio = async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const posts = await Post.find({ portfolio: portfolioId });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los posts del portafolio', error: err });
  }
};

// Obtener un post por ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post no encontrado' });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el post', error: err });
  }
};

// Actualizar un post
exports.updatePost = async (req, res) => {
  try {
    const updateData = {};

    for (const key in req.body) {
      if (req.body[key] !== '') {
        updateData[key] = req.body[key];
      }
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.postId, updateData, { new: true });
    if (!updatedPost) return res.status(404).json({ message: 'Post no encontrado' });
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar el post', error: err });
  }
};

// Eliminar un post
exports.deletePost = async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.postId);
    if (!deletedPost) return res.status(404).json({ message: 'Post no encontrado' });
    res.status(200).json({ message: 'Post eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el post', error: err });
  }
};
