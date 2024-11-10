const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const userRoutes = require('./routes/userRoutes');
const jobOfferRoutes = require('./routes/jobOfferRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolios', portfolioRoutes); // Prefijo específico para los portafolios
app.use('/api/services', serviceRoutes); // Prefijo específico para los servicios
app.use('/api/users', userRoutes); // Prefijo específico para los usuarios
app.use('/api/job-offers', jobOfferRoutes); // Prefijo específico para las ofertas de trabajo

// Connect to MongoDB
connectDB();

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
