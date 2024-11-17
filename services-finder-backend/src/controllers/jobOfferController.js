const JobOffer = require('../models/JobOffer');
const cloudinary = require('../../cloudinaryConfig');

// Crear una nueva oferta de trabajo
exports.createJobOffer = async (req, res) => {
  try {
    if (req.user.userType !== "Cliente") {
      return res.status(403).json({ message: 'Solo los clientes pueden crear ofertas de trabajo' });
    }

    const { title, description, category, budget, status } = req.body;
    const client = req.user.userId;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'Al menos una imagen es requerida' });
    }

    const imageUrls = [];
    for (const file of files) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'job-offer-images' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer);
      });
      imageUrls.push(result.secure_url);
    }

    const jobStatus = status ? "Activo" : "No disponible";
    const newJobOffer = new JobOffer({
      client,
      title,
      description,
      category,
      budget,
      status: jobStatus,
      images: imageUrls,
    });

    const savedJobOffer = await newJobOffer.save();
    res.status(201).json(savedJobOffer);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la oferta de trabajo', error });
  }
};

// Obtener todas las ofertas de trabajo
exports.getAllJobOffers = async (req, res) => {
  try {
    const jobOffers = await JobOffer.find();
    res.status(200).json(jobOffers);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las ofertas de trabajo', error });
  }
};

// Obtener todas las ofertas de trabajo de un cliente específico
exports.getJobOffersByClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const jobOffers = await JobOffer.find({ client: clientId });
    res.status(200).json(jobOffers);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las ofertas de trabajo del cliente', error });
  }
};

// Obtener una oferta de trabajo por ID
exports.getJobOfferById = async (req, res) => {
  try {
    const jobOffer = await JobOffer.findById(req.params.jobOfferId);
    if (!jobOffer) return res.status(404).json({ message: 'Oferta de trabajo no encontrada' });
    res.status(200).json(jobOffer);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la oferta de trabajo', error });
  }
};

exports.updateJobOffer = async (req, res) => {
  try {
    if (req.user.userType !== "Cliente") {
      return res.status(403).json({ message: 'Solo los clientes pueden actualizar ofertas de trabajo' });
    }

    const { jobOfferId } = req.params;
    const { removeImageUrls } = req.body;

    // Inicializar el objeto de actualización
    let update = {};

    // Manejar la eliminación de imágenes
    if (removeImageUrls) {
      const urlsToRemove = JSON.parse(removeImageUrls);
      const jobOffer = await JobOffer.findById(jobOfferId);
      if (jobOffer) {
        const filteredImages = jobOffer.images.filter(url => !urlsToRemove.includes(url));
        update.$set = { images: filteredImages };
      } else {
        return res.status(400).json({ message: 'URLs de imagen inválidas' });
      }
    }

    // Manejar la subida de nuevas imágenes
    if (req.files && req.files.length > 0) {
      const uploadedImages = [];
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'job-offer-images' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(file.buffer);
        });
        uploadedImages.push(result.secure_url);
      }

      // Añadir las nuevas imágenes usando $push
      if (!update.$push) {
        update.$push = {};
      }
      update.$push.images = { $each: uploadedImages };
    }

    // Manejar el campo de estado
    if (typeof req.body.status === "boolean") {
      const status = req.body.status ? "Activo" : "No disponible";
      if (!update.$set) {
        update.$set = {};
      }
      update.$set.status = status;
    } else if (req.body.status) {
      // Si el estado se envía como cadena, se establece directamente
      if (!update.$set) {
        update.$set = {};
      }
      update.$set.status = req.body.status;
    }

    // Actualizar otros campos si existen (excluyendo imágenes y estado)
    const fieldsToUpdate = { ...req.body };
    delete fieldsToUpdate.removeImageUrls;
    delete fieldsToUpdate.status;
    delete fieldsToUpdate.files;
    delete fieldsToUpdate.images; // Prevenir sobreescritura de imágenes

    if (Object.keys(fieldsToUpdate).length > 0) {
      if (!update.$set) {
        update.$set = {};
      }
      Object.assign(update.$set, fieldsToUpdate);
    }

    // Verificar la propiedad de la oferta
    const jobOffer = await JobOffer.findById(jobOfferId);
    if (!jobOffer) {
      return res.status(404).json({ message: 'Oferta de trabajo no encontrada' });
    }
    if (jobOffer.client.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'No tienes permiso para actualizar esta oferta de trabajo' });
    }

    // Realizar la actualización
    const updatedJobOffer = await JobOffer.findByIdAndUpdate(
      jobOfferId,
      update,
      { new: true }
    );

    res.status(200).json(updatedJobOffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la oferta de trabajo', error });
  }
};

// Eliminar una oferta de trabajo por ID
exports.deleteJobOffer = async (req, res) => {
  try {
    const jobOfferId = req.params.jobOfferId;
    console.log(`ID recibido para eliminación: ${jobOfferId}`);

    const deletedJobOffer = await JobOffer.findByIdAndDelete(jobOfferId);

    if (!deletedJobOffer) {
      return res.status(404).json({ message: 'Oferta de trabajo no encontrada' });
    }

    res.status(200).json({ message: 'Oferta de trabajo eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la oferta de trabajo', error });
  }
};

