const User = require('../models/User');
const Portfolio = require('../models/Portfolio');

const getUserById = async (req, res) => {
  // Limpia el userId eliminando espacios y saltos de línea adicionales
  const userId = req.params.userId.trim();

  try {
    const user = await User.findById(userId)
      .populate('services')
      .populate({
        path: 'portfolios',
        populate: {
          path: 'posts',
          model: 'Post'
        }
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
};

module.exports = {
  getUserById,
};
