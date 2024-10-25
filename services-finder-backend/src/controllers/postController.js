const Post = require('../models/Post');
const Portfolio = require('../models/Portfolio');

// Agregar posts a un portfolio existente
exports.addPostsToPortfolio = async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const { posts } = req.body;

    // Verificar que el portfolio exista
    const portfolio = await Portfolio.findById(portfolioId);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portafolio no encontrado' });
    }

    // Verificar que todos los posts existan
    const existingPosts = await Post.find({ _id: { $in: posts } });
    if (existingPosts.length !== posts.length) {
      return res.status(400).json({ message: 'Uno o más posts no existen' });
    }

    // Agregar los posts al portfolio
    portfolio.posts = [...portfolio.posts, ...posts];
    const updatedPortfolio = await portfolio.save();

    res.status(200).json(updatedPortfolio);
  } catch (error) {
    console.error("Error al agregar posts al portfolio:", error);
    res.status(500).json({ message: 'Error al agregar posts al portfolio' });
  }
};

// Crear un nuevo post asociado a un portafolio
exports.createPost = async (req, res) => {
  try {
    const { portfolioId } = req.params; // Obtenemos el ID del portafolio desde la URL
    const { title, description, images } = req.body;
    const newPost = new Post({ portfolio: portfolioId, title, description, images });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear el post', error: err });
  }
};

// Obtener todos los posts de un portafolio específico
exports.getPostsByPortfolio = async (req, res) => {
  try {
    const { portfolioId } = req.params; // Obtenemos el ID del portafolio desde la URL
    const posts = await Post.find({ portfolio: portfolioId }).populate('portfolio');
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los posts del portafolio', error: err });
  }
};

// Obtener un post por ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).populate('portfolio');
    if (!post) return res.status(404).json({ message: 'Post no encontrado' });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el post', error: err });
  }
};

// Actualizar un post
exports.updatePost = async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.postId, req.body, { new: true });
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
