// server.js
const express = require('express');
const cors = require('cors');
const http = require('http');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const userRoutes = require('./routes/userRoutes');
const jobOfferRoutes = require('./routes/jobOfferRoutes');
const chatRoutes = require('./routes/chatRoutes');
const configureSocket = require('./socket/socketConfig');

const app = express();
const server = http.createServer(app);

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Adjust based on frontend URL
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
}));
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/job-offers', jobOfferRoutes);
app.use('/api/chats', chatRoutes);

// Configure Socket.IO with the HTTP server
configureSocket(server);

// Global error handler (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error' });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
