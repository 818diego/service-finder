const Service = require('../models/Service');

// Crear un nuevo servicio en un portafolio específico
exports.createService = async (req, res) => {
  try {
    const { title, description, images } = req.body;
    const portfolio = req.params.portfolioId;

    const newService = new Service({
      title,
      description,
      images,
      portfolio,
    });

    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el servicio', error });
  }
};

// Obtener todos los servicios de un portafolio específico
exports.getServicesByPortfolio = async (req, res) => {
  try {
    const services = await Service.find({ portfolio: req.params.portfolioId }).populate('portfolio');
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los servicios', error });
  }
};


// Obtener un servicio por su ID
exports.getServiceById = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const service = await Service.findById(serviceId).populate('portfolio'); // Carga también el portafolio asociado
    if (!service) return res.status(404).json({ message: 'Servicio no encontrado' });

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el servicio', error });
  }
};

exports.updateServiceById = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const updates = req.body; // Obtenemos los campos a actualizar desde el cuerpo de la solicitud

    const updatedService = await Service.findByIdAndUpdate(serviceId, updates, { new: true });
    if (!updatedService) return res.status(404).json({ message: 'Servicio no encontrado' });
    
    res.status(200).json(updatedService);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el servicio', error });
  }
};

// Eliminar un servicio por ID
exports.deleteService = async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.serviceId);
    if (!deletedService) return res.status(404).json({ message: 'Servicio no encontrado' });
    res.status(200).json({ message: 'Servicio eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el servicio', error });
  }
};
