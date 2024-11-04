const JobOffer = require('../models/JobOffer');

// Crear una nueva oferta de trabajo
exports.createJobOffer = async (req, res) => {
  try {
    if (req.user.userType !== "Cliente") {
      return res.status(403).json({ message: 'Solo los clientes pueden crear ofertas de trabajo' });
    }

    const { title, description, category, budget, status, images } = req.body;
    const client = req.user.userId;

    const jobStatus = status ? "Activo" : "No disponible";
    const newJobOffer = new JobOffer({
      client,
      title,
      description,
      category,
      budget,
      status: jobStatus,
      images,
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

// Actualizar una oferta de trabajo por ID
exports.updateJobOffer = async (req, res) => {
  try {
    if (req.user.userType !== "Cliente") {
      return res.status(403).json({ message: 'Solo los clientes pueden actualizar ofertas de trabajo' });
    }

    const { jobOfferId } = req.params;
    const updatedData = req.body;

    if (typeof updatedData.status === "boolean") {
      updatedData.status = updatedData.status ? "Activo" : "No disponible";
    }

    const jobOffer = await JobOffer.findById(jobOfferId);
    if (!jobOffer) {
      return res.status(404).json({ message: 'Oferta de trabajo no encontrada' });
    }
    if (jobOffer.client.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'No tienes permiso para actualizar esta oferta de trabajo' });
    }

    const updatedJobOffer = await JobOffer.findByIdAndUpdate(
      jobOfferId,
      { $set: updatedData },
      { new: true }
    );

    res.status(200).json(updatedJobOffer);
  } catch (error) {
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

