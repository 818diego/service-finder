const Service = require('../models/Service');
const Portfolio = require('../models/Portfolio');
const Post = require('../models/Post');
const User = require('../models/User');

// Crear un servicio
const createService = async (req, res) => {
  try {
    const { userId } = req.user; // Asegúrate de que el middleware pase correctamente el userId
    const { title, description, price, duration, category } = req.body;

    // Crear un nuevo servicio
    const newService = new Service({
      provider: userId,
      title,
      description,
      price,
      duration,
      category
    });

    // Guardar el servicio en la base de datos
    const savedService = await newService.save();

    // Crear un portfolio para este servicio
    const newPortfolio = new Portfolio({
      service: savedService._id,
      posts: [] // Inicialmente vacío
    });

    // Guardar el portfolio en la base de datos
    const savedPortfolio = await newPortfolio.save();

    // Asociar el portfolio al servicio
    savedService.portfolio = savedPortfolio._id;
    await savedService.save();

    // Agregar el ID del servicio al array de servicios del usuario
    await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          services: savedService._id,
          portfolios: savedPortfolio._id
        }
      },
      { new: true }
    );

    res.status(201).json(savedService);
  } catch (error) {
    console.error("Error al crear el servicio:", error);
    res.status(500).json({ message: 'Error al crear el servicio', error: error.message });
  }
};

// Obtener todos los servicios (por ejemplo, para una página pública de servicios)
const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate('provider').populate('portfolio');
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los servicios' });
  }
};

// Obtener todos los servicios de un usuario específico por su ID
const getServicesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const services = await Service.find({ provider: userId });

    if (!services || services.length === 0) {
      return res.status(404).json({ message: 'No se encontraron servicios para este usuario' });
    }

    res.status(200).json(services);
  } catch (error) {
    console.error("Error al obtener los servicios del usuario:", error);
    res.status(500).json({ message: 'Error al obtener los servicios del usuario' });
  }
};

// Obtener un servicio por ID
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el servicio' });
  }
};

// Actualizar un servicio
const updateService = async (req, res) => {
  try {
    const updateData = {};

    for (const key in req.body) {
      if (req.body[key] !== '') {  
        updateData[key] = req.body[key];
      }
    }

    const updatedService = await Service.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedService) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }
    res.status(200).json(updatedService);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el servicio', error });
  }
};


// Eliminar un servicio
const deleteService = async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);
    if (!deletedService) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }

    // Elimina el portfolio asociado al servicio
    if (deletedService.portfolio) {
      // Elimina todos los posts asociados a ese portfolio
      await Post.deleteMany({ portfolio: deletedService.portfolio });
      // Luego elimina el portfolio
      await Portfolio.findByIdAndDelete(deletedService.portfolio);
    }

    res.status(200).json({ message: 'Servicio y sus datos relacionados eliminados correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el servicio y sus datos relacionados' });
  }
};


module.exports = {
  createService,
  getServicesByUserId,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};
