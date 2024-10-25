const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

exports.register = [
  // Validate and sanitize inputs
  body('username').isLength({ min: 5 }).trim().escape(),
  body('firstName').isLength({ min: 3 }).trim().escape(),
  body('lastName').isLength({ min: 3 }).trim().escape(),
  body('userType').isIn(['Cliente', 'Proveedor']).trim().escape(),
  body('email').isEmail().normalizeEmail(),
  body('address').isLength({ min: 10 }).trim().escape(),
  body('specialty').optional().trim().escape(),
  body('password').isLength({ min: 8 }).trim().escape(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, firstName, lastName, userType, email, address, specialty, password } = req.body;

      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res.status(400).json({ error: 'This user already exists' });
      }

      const user = new User({ username, firstName, lastName, userType, email, address, specialty, password });
      await user.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
];

exports.login = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).trim().escape(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      // Verificar si el usuario existe y la contraseña es correcta
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Payload del token, incluyendo el userId, username, userType y email
      const tokenPayload = {
        userId: user._id,
        username: user.username,
        userType: user.userType,
        email: user.email
      };

      // Firmar el token con una duración de 1 hora
      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Devolver el token al cliente
      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
];
