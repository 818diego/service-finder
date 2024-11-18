const jwt = require("jsonwebtoken");
const Chat = require("../models/Chat");
const User = require("../models/User");
const mongoose = require("mongoose");
const Service = require("../models/Service");
const Portfolio = require("../models/Portfolio");
const JobOffer = require("../models/JobOffer");

exports.createChat = async (req, res) => {
  const { serviceId, jobOfferId, initialMessage } = req.body;

  try {
    if ((!serviceId && !jobOfferId) || !initialMessage) {
      console.log("Faltan datos necesarios en la solicitud.");
      return res.status(400).json({ message: "Faltan datos necesarios en la solicitud." });
    }

    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { userId, userType } = decodedToken;

    let clientId, providerId;

    if (userType === "Cliente") {
      clientId = userId;
      const service = await Service.findById(serviceId);
      if (!service) {
        console.log("Servicio no encontrado para el ID:", serviceId);
        return res.status(404).json({ message: "Servicio no encontrado" });
      }

      const portfolio = await Portfolio.findById(service.portfolio);
      if (!portfolio) {
        console.log("Portafolio no encontrado para el servicio");
        return res.status(404).json({ message: "Portafolio no encontrado" });
      }

      providerId = portfolio.provider;
      if (!providerId) {
        console.log("No se encontró el proveedor para este portafolio.");
        return res.status(404).json({ message: "Proveedor no encontrado para el servicio." });
      }

    } else if (userType === "Proveedor") {
      providerId = userId;
      const jobOffer = await JobOffer.findById(jobOfferId);
      if (!jobOffer) {
        console.log("Oferta de trabajo no encontrada para el ID:", jobOfferId);
        return res.status(404).json({ message: "Oferta de trabajo no encontrada" });
      }

      clientId = jobOffer.client;
      if (!clientId) {
        console.log("No se encontró el cliente para esta oferta de trabajo.");
        return res.status(404).json({ message: "Cliente no encontrado para la oferta de trabajo." });
      }
    } else {
      console.log("Tipo de usuario no válido:", userType);
      return res.status(400).json({ message: "Tipo de usuario no válido" });
    }

    const chat = new Chat({
      clientId,
      providerId,
      serviceId: serviceId || undefined,
      jobOfferId: jobOfferId || undefined,
      messages: [
        {
          text: initialMessage,
          sentBy: userId,
          time: new Date(),
        },
      ],
      unreadByProvider: userType === "Cliente",
      unreadByClient: userType === "Proveedor",
      status: userType === "Cliente" ? "pending" : "accepted",
    });
    await chat.save();
    console.log("Nuevo chat creado:", chat._id);

    const io = req.app.get("socketio");
    if (io) {
      io.to(clientId.toString()).emit("newChatRequest", {
        chatId: chat._id,
        clientId,
        providerId,
        serviceId,
        jobOfferId,
        initialMessage,
      });
    } else {
      console.error("Socket.IO instance is not available");
    }

    res.status(201).json(chat);
  } catch (error) {
    console.error("Error en la creación del chat:", error);
    res.status(500).json({ message: "Error al crear el chat" });
  }
};

// Para que el proveedor pueda aceptar o rechazar un chat
exports.updateChatStatus = async (req, res) => {
  const { chatId } = req.params;
  const { action } = req.body; // Puede ser "accept" o "reject"
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const { userId, userType } = decodedToken;

  // Solo el proveedor puede aceptar o rechazar el chat
  if (userType !== "Proveedor") {
    return res.status(403).json({ message: "Solo los proveedores pueden aceptar o rechazar chats." });
  }

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat no encontrado" });
    }

    if (chat.providerId.toString() !== userId) {
      return res.status(403).json({ message: "No tienes permiso para aceptar o rechazar este chat." });
    }

    if (chat.status !== "pending") {
      return res.status(400).json({ message: "Este chat ya ha sido procesado." });
    }

    // Actualizar el estado del chat según la acción
    if (action === "accept") {
      chat.status = "accepted";
    } else if (action === "reject") {
      chat.status = "rejected";
    } else {
      return res.status(400).json({ message: "Acción no válida." });
    }

    await chat.save();

    res.status(200).json({ message: `Chat ${action === "accept" ? "aceptado" : "rechazado"}`, chat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el estado del chat" });
  }
};

exports.sendMessage = async (req, res) => {
  const { chatId, text } = req.body;
  const userId = req.user.userId;
  const userType = req.user.userType;

  if (!userId) {
    return res.status(400).json({ message: "El ID del usuario no está definido" });
  }

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat no encontrado" });
    }

    if (chat.status !== "accepted") {
      return res.status(403).json({ message: "El chat aún no ha sido aceptado por el proveedor." });
    }

    // Crear el nuevo mensaje con `sentBy`
    const newMessage = {
      text,
      sentBy: userId, // Asegúrate de que `userId` esté definido antes de asignarlo
      time: new Date(),
    };

    chat.messages.push(newMessage);

    // Configurar el estado de no leído basado en `userType`
    if (userType === "Cliente") {
      chat.unreadByProvider = true;
    } else if (userType === "Proveedor") {
      chat.unreadByClient = true;
    }

    await chat.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
    res.status(500).json({ message: "Error al enviar mensaje" });
  }
};

// Obtener el estado de un usuario (en línea o última vez visto)
exports.getUserStatus = async (req, res) => {
  const { userId } = req.params;

  try {
    // Buscar el usuario por su ID y obtener solo los campos `isOnline` y `lastSeen`
    const user = await User.findById(userId).select("isOnline lastSeen");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Emitir el estado del usuario a través de Socket.IO
    const io = req.app.get("socketio");
    if (io) {
      io.emit("userStatus", {
        userId: user._id.toString(),
        isOnline: user.isOnline,
        lastSeen: user.isOnline ? null : user.lastSeen,
      });
    }

    // Enviar el estado del usuario
    res.json({
      isOnline: user.isOnline,
      lastSeen: user.isOnline ? null : user.lastSeen,
    });
  } catch (error) {
    console.error("Error al obtener el estado del usuario:", error);
    res.status(500).json({ message: "Error al obtener el estado del usuario" });
  }
};

exports.getUserChats = async (req, res) => {
  const { userId, userType } = req.user;

  try {
    // Define el filtro según el tipo de usuario
    const filter = userType === "Proveedor" ? { providerId: userId } : { clientId: userId };

    // Ejecuta la consulta con populate para incluir los detalles del usuario
    const chats = await Chat.find(filter)
      .populate("clientId", "username",)
      .populate("providerId", "username")
      .exec();
    res.json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los chats" });
  }
};

// Obtener un chat específico por su ID
exports.getChatById = async (req, res) => {
  const { id } = req.params;

  try {
    const chat = await Chat.findById(id)
      .populate("clientId", "username profileImage") // Trae los campos necesarios del cliente
      .populate("providerId", "username profileImage") // Trae los campos necesarios del proveedor
      .exec();

    if (!chat) {
      return res.status(404).json({ message: "Chat no encontrado" });
    }

    res.json(chat);
  } catch (error) {
    console.error("Error al obtener el chat:", error);
    res.status(500).json({ message: "Error al obtener el chat" });
  }
};

// Marcar mensajes como leídos
exports.markAsRead = async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user.userId;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat no encontrado" });

    // Verifica si el usuario es el cliente o el proveedor y actualiza el estado de lectura
    if (chat.clientId.toString() === userId) {
      chat.unreadByClient = false;
    } else if (chat.providerId.toString() === userId) {
      chat.unreadByProvider = false;
    }

    await chat.save();
    res.status(200).json({ message: "Mensajes marcados como leídos" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al marcar mensajes como leídos" });
  }
};

// Eliminar un chat por su ID
exports.deleteChat = async (req, res) => {
  const { id: chatId } = req.params; // Cambiado a 'id'
  const userId = req.user?.userId;

  console.log("Request params:", req.params);
  console.log("Chat ID from request params:", chatId);
  console.log("User ID from request:", userId);

  if (!chatId || !mongoose.Types.ObjectId.isValid(chatId)) {
    return res.status(400).json({ message: "ID de chat inválido" });
  }

  if (!userId) {
    return res.status(400).json({ message: "ID de usuario no proporcionado" });
  }

  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat no encontrado" });
    }

    if (chat.clientId.toString() !== userId && chat.providerId.toString() !== userId) {
      console.log("Usuario no autorizado para eliminar este chat");
      return res.status(403).json({ message: "No tienes permiso para eliminar este chat" });
    }

    await Chat.findByIdAndDelete(chatId);
    console.log("Chat eliminado exitosamente");

    res.status(200).json({ message: "Chat eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar el chat:", error);
    res.status(500).json({ message: "Error al eliminar el chat" });
  }
};