const User = require('../models/User');
const JobOffer = require('../models/JobOffer');

const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await
    User.findById
    (userId)
    .populate('jobOffers')
    .populate('applications')
    .exec();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(user);
  }
  catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getUserById,
};
