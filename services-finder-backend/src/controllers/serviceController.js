const Service = require('../models/Service');

const cloudinary = require('../../cloudinaryConfig');

exports.createService = async (req, res) => {
  try {
    const { title, description, portfolio, price } = req.body;
    const files = req.files; // Para manejar múltiples imágenes
    
    // Verificar que al menos una imagen esté presente
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'Al menos una imagen es requerida' });
    }

    // Subir cada imagen a Cloudinary y almacenar las URLs en un arreglo
    const imageUrls = [];
    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'service-images',
      });
      imageUrls.push(result.secure_url);
    }

    // Crear el servicio con las URLs de las imágenes en Cloudinary
    const newService = new Service({
      title,
      description,
      portfolio,
      price,
      images: imageUrls, // URLs de las imágenes subidas
    });

    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (error) {
    console.error('Error al crear el servicio:', error);
    res.status(500).json({ message: 'Error al crear el servicio', error: error.message });
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
