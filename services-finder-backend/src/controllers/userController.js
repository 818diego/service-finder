const User = require('../models/User');
const JobOffer = require('../models/JobOffer');

const getUserById = async (req, res) => {
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

    let userData;
    if (user.userType === "Proveedor") {
      userData = {
        userId: user._id,
        userType: user.userType,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        address: user.address,
        specialty: user.specialty,
        services: user.services,
        portfolios: user.portfolios,
      };
    } else if (user.userType === "Cliente") {
      const offers = await JobOffer.find({ client: userId });

      userData = {
        userId: user._id,
        userType: user.userType,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        address: user.address,
        offers: offers,
      };
    } else {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    res.status(200).json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
};

module.exports = {
  getUserById,
};
