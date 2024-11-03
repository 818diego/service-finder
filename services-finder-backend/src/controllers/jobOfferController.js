const JobOffer = require('../models/JobOffer');

// Crear una nueva oferta de trabajo
exports.createJobOffer = async (req, res) => {
  try {
    const { title, description, category, budget } = req.body;
    const client = req.user.userId; // ID del cliente autenticado

    const newJobOffer = new JobOffer({
      client,
      title,
      description,
      category,
      budget,
      status: 'open',
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
    const jobOffers = await JobOffer.find().populate('client');
    res.status(200).json(jobOffers);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las ofertas de trabajo', error });
  }
};

// Obtener todas las ofertas de trabajo de un cliente específico
exports.getJobOffersByClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const jobOffers = await JobOffer.find({ client: clientId }).populate('client');
    res.status(200).json(jobOffers);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las ofertas de trabajo del cliente', error });
  }
};

// Obtener una oferta de trabajo por ID
exports.getJobOfferById = async (req, res) => {
  try {
    const jobOffer = await JobOffer.findById(req.params.id).populate('client');
    if (!jobOffer) return res.status(404).json({ message: 'Oferta de trabajo no encontrada' });
    res.status(200).json(jobOffer);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la oferta de trabajo', error });
  }
};

// Actualizar una oferta de trabajo por ID
exports.updateJobOffer = async (req, res) => {
  try {
    const { title, description, category, budget, status } = req.body;
    const updatedJobOffer = await JobOffer.findByIdAndUpdate(
      req.params.id,
      { title, description, category, budget, status },
      { new: true }
    );
    if (!updatedJobOffer) return res.status(404).json({ message: 'Oferta de trabajo no encontrada' });
    res.status(200).json(updatedJobOffer);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la oferta de trabajo', error });
  }
};

// Eliminar una oferta de trabajo por ID
exports.deleteJobOffer = async (req, res) => {
  try {
    const deletedJobOffer = await JobOffer.findByIdAndDelete(req.params.id);
    if (!deletedJobOffer) return res.status(404).json({ message: 'Oferta de trabajo no encontrada' });
    res.status(200).json({ message: 'Oferta de trabajo eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la oferta de trabajo', error });
  }
};
