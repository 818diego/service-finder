const jwt = require("jsonwebtoken");
const Chat = require("../models/Chat");
const Portfolio = require("../models/Portfolio");
const User = require("../models/User");
const mongoose = require("mongoose");

exports.createChat = async (req, res) => {
  const { portfolioId, initialMessage } = req.body;

  try {
    // Verifica que `portfolioId` y `initialMessage` existan en el body
    if (!portfolioId || !initialMessage) {
      console.log("Faltan datos necesarios en la solicitud."); // Depuración
      return res.status(400).json({ message: "Faltan datos necesarios en la solicitud." });
    }

    // Extrae el token para obtener userId y userType
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { userId, userType } = decodedToken;

    let clientId, providerId;

    if (userType === "Cliente") {
      clientId = userId;
      const portfolio = await Portfolio.findById(portfolioId);
      if (!portfolio) {
        console.log("Portafolio no encontrado para el ID:", portfolioId); // Depuración
        return res.status(404).json({ message: "Portafolio no encontrado" });
      }
      providerId = portfolio.provider;
    } else if (userType === "Proveedor") {
      console.log("Los proveedores no pueden iniciar un chat."); // Depuración
      return res.status(403).json({ message: "Solo los clientes pueden iniciar un chat." });
    } else {
      console.log("Tipo de usuario no válido:", userType); // Depuración
      return res.status(400).json({ message: "Tipo de usuario no válido" });
    }

    // Crear un nuevo chat en estado `pending` con el primer mensaje del cliente
    const chat = new Chat({
      clientId,
      providerId,
      portfolioId,
      messages: [
        {
          text: initialMessage,
          sentBy: clientId,
          time: new Date(),
        },
      ],
      unreadByProvider: true,
      status: "pending",
    });
    await chat.save();
    console.log("Nuevo chat creado:", chat._id); // Depuración

    // Emitir evento de WebSocket al proveedor
    const io = req.app.get("socketio");
    if (io) {
      io.to(providerId.toString()).emit("newChatRequest", {
        chatId: chat._id,
        clientId,
        providerId,
        portfolioId,
        initialMessage,
      });
    } else {
      console.error("Socket.IO instance is not available");
    }

    res.status(201).json(chat);
  } catch (error) {
    console.error("Error en la creación del chat:", error); // Depuración
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
  const userId = req.user._id;
  const userType = req.user.userType; // Get the userType from the decoded token

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat no encontrado" });
    }

    if (chat.status !== "accepted") {
      return res.status(403).json({ message: "El chat aún no ha sido aceptado por el proveedor." });
    }

    const newMessage = {
      text,
      sentBy: userId,
      time: new Date(),
    };

    chat.messages.push(newMessage);

    // Set the unread status based on userType
    if (userType === "Cliente") {
      chat.unreadByProvider = true; // Message is unread for the provider
    } else if (userType === "Proveedor") {
      chat.unreadByClient = true; // Message is unread for the client
    }

    await chat.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
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
    console.log("Chat found:", chat);

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