const Service = require('../models/Service');
const Portfolio = require('../models/Portfolio');

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
  
      res.status(201).json(savedService);
    } catch (error) {
      console.error("Error al crear el servicio:", error); // Esto imprime el error en los logs del servidor
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

// Obtener un servicio por ID
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('provider').populate('portfolio');
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
    const { title, description, price, duration, category } = req.body;
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { title, description, price, duration, category },
      { new: true }
    );
    if (!updatedService) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }
    res.status(200).json(updatedService);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el servicio' });
  }
};

// Eliminar un servicio
const deleteService = async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);
    if (!deletedService) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }
    res.status(200).json({ message: 'Servicio eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el servicio' });
  }
};

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService
};
