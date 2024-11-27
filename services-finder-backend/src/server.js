const express = require('express');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
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

// Load SSL certificates
const sslOptions = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH)
};

const server = https.createServer(sslOptions, app);

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: ['http://152.53.55.46:5173', 'http://localhost:5173', 'http://152.53.55.46:8081', 'https://services.supremito.xyz'],
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  credentials: true
}));
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/job-offers', jobOfferRoutes);
app.use('/api/chats', chatRoutes);

// Initialize Socket.IO
const io = configureSocket(server);

// Attach IO instance globally (if needed elsewhere)
app.set('socketio', io);

// Global error handler (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error' });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
