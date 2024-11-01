const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
