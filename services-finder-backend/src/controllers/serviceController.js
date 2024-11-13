const Service = require('../models/Service');
const Portfolio = require('../models/Portfolio');
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
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'service-images' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer); // Enviar el buffer de la imagen a Cloudinary
      });
      imageUrls.push(result.secure_url); // Agregar la URL de la imagen a `imageUrls`
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

    await Portfolio.findByIdAndUpdate(portfolio, { $push: { services: savedService._id } });

    res.status(201).json(savedService);
  } catch (error) {
    console.error('Error al crear el servicio:', error);
    res.status(500).json({ message: 'Error al crear el servicio', error: error.message });
  }
};

// Obtener todos los servicios de un portafolio específico
exports.getServicesByPortfolio = async (req, res) => {
  try {
    const services = await Service.find({ portfolio: req.params.portfolioId });
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
    const { removeImageUrls } = req.body;
    const updates = { ...req.body };

    if (removeImageUrls) {
      const urlsToRemove = JSON.parse(removeImageUrls);
      const service = await Service.findById(serviceId);
      if (service) {
        service.images = service.images.filter((url) => !urlsToRemove.includes(url));
        updates.images = service.images;
      } else {
        return res.status(400).json({ message: 'URLs de imagen inválidas' });
      }
    }

    if (req.files && req.files.length > 0) {
      const uploadedImages = [];
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'service-images' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(file.buffer);
        });
        uploadedImages.push(result.secure_url);
      }
      updates.$push = { images: { $each: uploadedImages } };
    }

    const updatedService = await Service.findByIdAndUpdate(serviceId, updates, { new: true });
    if (!updatedService) return res.status(404).json({ message: 'Servicio no encontrado' });

    res.status(200).json(updatedService);
  } catch (error) {
    console.error("Error al actualizar el servicio:", error);
    res.status(500).json({ message: 'Error al actualizar el servicio', error: error.message });
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
