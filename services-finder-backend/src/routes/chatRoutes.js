const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const { getChatById } = require("../controllers/chatController");
const authMiddleware = require("../middleware/auth");


// Crear un nuevo chat con un mensaje inicial
router.post("/create", authMiddleware, chatController.createChat);

// Aceptar o rechazar un chat por parte del proveedor
router.post("/update-status/:chatId", authMiddleware, chatController.updateChatStatus);

// Enviar mensaje en un chat específico (solo si el chat está aceptado)
router.post("/send-message", authMiddleware, chatController.sendMessage);

// Obtener el estado en línea de un usuario
router.get("/status/:userId", authMiddleware, chatController.getUserStatus);

// Obtener todos los chats del usuario autenticado (se basa en su userType)
router.get("/user-chats", authMiddleware, chatController.getUserChats);

// Marcar un chat como leído
router.put("/mark-as-read/:chatId", authMiddleware, chatController.markAsRead);

// Obtener un chat por su ID
router.get("/:id", authMiddleware, getChatById);

// Eliminar un chat por su ID
router.delete("/delete/:id", authMiddleware, chatController.deleteChat);



module.exports = router;
