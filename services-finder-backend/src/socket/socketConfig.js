const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Chat = require("../models/Chat");

const configureSocket = (server) => {
  console.log("Configuring socket server...");

  const io = new Server(server, {
    cors: {
      origin: "http://node2.frokie.it:5173", // Allow requests from your frontend
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    console.log("Authenticating socket connection...");

    const token = socket.handshake.auth.token;
    if (!token) {
      console.error("No token provided in socket handshake");
      return next(new Error("Authentication error"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      console.error("Invalid token:", err.message);
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("New user connected:", socket.user.userId);

    // Unir al usuario a su propia sala para notificaciones específicas
    socket.join(socket.user.userId);
    console.log(`User ${socket.user.userId} joined their personal notification room`);

    User.findByIdAndUpdate(socket.user.userId, { isOnline: true })
      .exec()
      .then(() => {
        console.log(`User ${socket.user.userId} set to online`);
        io.emit("userStatus", {
          userId: socket.user.userId,
          isOnline: true,
          lastSeen: null,
        });
      })
      .catch((err) => console.error("Error setting user to online:", err));

    socket.on("joinChat", ({ chatId }) => {
      socket.join(chatId);
      console.log(`User ${socket.user.userId} joined chat ${chatId}`);
    });

    socket.on("sendMessage", async ({ chatId, message }) => {
      console.log(`User ${socket.user.userId} sent a message in chat ${chatId}`);

      // Enviar el mensaje en tiempo real a todos los usuarios en la sala del chat
      io.to(chatId).emit("receiveMessage", {
        chatId,
        message,
        senderId: socket.user.userId,
        senderType: socket.user.userType,
      });

      try {
        const chat = await Chat.findById(chatId).populate("clientId providerId");
        if (chat && chat.clientId && chat.providerId) {
          console.log("Chat found:", chat);
          console.log("Client ID:", chat.clientId._id);
          console.log("Provider ID:", chat.providerId._id);

          // Determinar al destinatario de la notificación
          const recipient =
            chat.clientId._id.toString() === socket.user.userId
              ? chat.providerId
              : chat.clientId;

          // Enviar notificación solo al destinatario
          if (recipient && recipient._id) {
            io.to(recipient._id.toString()).emit("notification", {
              type: "newMessage",
              message: `You have a new message from ${socket.user.userType === "Proveedor"
                ? chat.providerId.username
                : chat.clientId.username
                }`,
              chatId,
              senderId: socket.user.userId,
            });
            console.log("New message notification sent to:", recipient._id.toString());
          } else {
            console.error("Recipient does not have a valid _id:", recipient);
          }
        } else {
          console.error("Chat or recipient not found for chatId:", chatId);
        }
      } catch (error) {
        console.error("Error finding chat or sending notification:", error);
      }
    });

    socket.on("sendProposal", async ({ chatId, proposal }) => {
      console.log(`User ${socket.user.userId} sent a proposal in chat ${chatId}`);
    
      // Emitir la propuesta en tiempo real a todos los usuarios en la sala del chat, excepto al remitente
      socket.broadcast.to(chatId).emit("receiveProposal", {
        chatId,
        proposal,
        senderId: socket.user.userId,
        senderType: socket.user.userType,
      });
      console.log("Proposal broadcasted to chat room:", chatId);
    
      // Emitir también la propuesta de manera local solo para el remitente
      socket.emit("receiveProposal", {
        chatId,
        proposal,
        senderId: socket.user.userId,
        senderType: socket.user.userType,
      });
      console.log("Proposal emitted to sender:", socket.user.userId);
    
      try {
        const chat = await Chat.findById(chatId).populate("clientId providerId");
        if (chat && chat.clientId && chat.providerId) {
          console.log("Chat found with client and provider populated:", chat);
    
          // Determinar al destinatario de la notificación (solo el proveedor en este caso)
          const recipient =
            chat.clientId._id.toString() === socket.user.userId
              ? chat.providerId  // Notificar al proveedor si el remitente es el cliente
              : chat.clientId;   // Notificar al cliente si el remitente es el proveedor
    
          // Asegurarse de que el destinatario sea un proveedor antes de enviar la notificación
          if (recipient && recipient._id && recipient.userType === "Proveedor") {
            io.to(recipient._id.toString()).emit("notification", {
              type: "newProposal",
              message: `You have a new proposal from ${socket.user.userType === "Proveedor"
                ? chat.providerId.username
                : chat.clientId.username}`,
              chatId,
              senderId: socket.user.userId,
            });
            console.log("New proposal notification sent to provider:", recipient._id.toString());
          } else {
            console.error("Recipient is not a provider or does not have a valid _id:", recipient);
          }
        } else {
          console.error("Chat or recipient not found for chatId:", chatId);
        }
      } catch (error) {
        console.error("Error finding chat or sending notification:", error);
      }
    });
    

    socket.on("updateChatStatus", async ({ chatId, status }) => {
      try {
        const chat = await Chat.findByIdAndUpdate(chatId, { status }, { new: true });
        if (chat && chat.clientId && chat.providerId) {
          const recipient = chat.clientId.userId === socket.user.userId
            ? chat.providerId
            : chat.clientId;

          const notificationMessage =
            status === "accepted"
              ? "Your chat request has been accepted"
              : "Your chat request has been rejected";

          io.to(recipient.userId).emit("notification", {
            type: "chatStatusUpdate",
            message: notificationMessage,
            chatId,
            status,
          });
          console.log("Chat status update notification sent to:", recipient.userId);
        } else {
          console.error("Chat or recipient not found for chatId:", chatId);
        }
      } catch (error) {
        console.error("Error updating chat status or sending notification:", error);
      }
    });

    socket.on("disconnect", async () => {
      console.log("User disconnected:", socket.user.userId);

      try {
        await User.findByIdAndUpdate(socket.user.userId, {
          isOnline: false,
          lastSeen: new Date(),
        });
        console.log(`User ${socket.user.userId} set to offline and lastSeen updated`);
        io.emit("userStatus", {
          userId: socket.user.userId,
          isOnline: false,
          lastSeen: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Error updating user status on disconnect:", err);
      }
    });
  });
};

module.exports = configureSocket;
