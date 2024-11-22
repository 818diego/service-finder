const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Chat = require("../models/Chat");
const JobOffer = require("../models/JobOffer");

const configureSocket = (server) => {
  console.log("Configuring socket server...");

  const io = new Server(server, {
    cors: {
      origin: ["http://152.53.55.46:5173", "http://152.53.55.46:8081", 'https://services.supremito.xyz'], // Allow requests from multiple origins
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Middleware para autenticación de sockets
  io.use((socket, next) => {
    console.log("Authenticating socket connection...");
    const token = socket.handshake.auth?.token;

    if (!token) {
      console.error("No token provided in socket handshake");
      return next(new Error("Authentication error"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // Guardar usuario autenticado
      next();
    } catch (err) {
      console.error("Invalid token:", err.message);
      next(new Error("Invalid token"));
    }
  });

  // Eventos del servidor Socket.IO
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user?.userId}`);

    if (!socket.user?.userId) {
      console.error("User ID missing, disconnecting socket...");
      return socket.disconnect();
    }

    // Unir al usuario a su sala personal
    socket.join(socket.user.userId);
    console.log(`User ${socket.user.userId} joined personal notification room`);

    // Actualizar estado del usuario a "online"
    User.findByIdAndUpdate(socket.user.userId, { isOnline: true })
      .then(() => {
        console.log(`User ${socket.user.userId} is now online`);
        io.emit("userStatus", {
          userId: socket.user.userId,
          isOnline: true,
          lastSeen: null,
        });
      })
      .catch((err) => console.error("Error setting user to online:", err));

    // Eventos personalizados
    socket.on("joinChat", ({ chatId }) => {
      socket.join(chatId);
      console.log(`User ${socket.user.userId} joined chat ${chatId}`);
    });

    socket.on("sendMessage", async ({ chatId, message }) => {
      console.log(`User ${socket.user.userId} sent a message in chat ${chatId}`);

      // Emitir mensaje en tiempo real
      io.to(chatId).emit("receiveMessage", {
        chatId,
        message,
        senderId: socket.user.userId,
        senderType: socket.user.userType,
      });

      // Notificar al destinatario
      try {
        const chat = await Chat.findById(chatId).populate("clientId providerId");
        if (chat && chat.clientId && chat.providerId) {
          const recipient =
            chat.clientId._id.toString() === socket.user.userId
              ? chat.providerId
              : chat.clientId;

          if (recipient?._id) {
            io.to(recipient._id.toString()).emit("notification", {
              type: "newMessage",
              message: `You have a new message from ${socket.user.userType}`,
              chatId,
              senderId: socket.user.userId,
            });
          }
        }
      } catch (error) {
        console.error("Error notifying recipient:", error);
      }
    });

    socket.on("sendProposal", async ({ chatId, proposal }) => {
      console.log(`User ${socket.user.userId} sent a proposal in chat ${chatId}`);

      // Emitir la propuesta al chat correspondiente
      socket.broadcast.to(chatId).emit("receiveProposal", {
        chatId,
        proposal,
        senderId: socket.user.userId,
        senderType: socket.user.userType,
      });

      try {
        const chat = await Chat.findById(chatId).populate("clientId providerId");
        if (chat && chat.clientId && chat.providerId) {
          // El destinatario será el proveedor
          const recipient =
            chat.clientId._id.toString() === socket.user.userId
              ? chat.providerId
              : chat.clientId;

          if (recipient?._id) {
            // Emitir la notificación al destinatario
            io.to(recipient._id.toString()).emit("notification", {
              type: "newProposal",
              message: `You have received a new proposal`,
              chatId,
              proposal,
              senderId: socket.user.userId,
              senderName: socket.user.name || "Unknown User",
            });
            console.log(
              `Notification sent to recipient ${recipient._id.toString()}`
            );
          }
        }
      } catch (error) {
        console.error("Error notifying recipient:", error);
      }
    });

    socket.on("sendJobProposal", async ({ jobOfferId, proposal }) => {
      console.log(`User ${socket.user.userId} sent a proposal for job ${jobOfferId}`);

      try {
        const jobOffer = await JobOffer.findById(jobOfferId).populate("client");
        if (jobOffer && jobOffer.client) {
          const recipient = jobOffer.client;

          if (recipient?._id) {
            // Emitir la notificación al cliente propietario de la oferta
            io.to(recipient._id.toString()).emit("notification", {
              type: "newJobProposal",
              message: `You have received a proposal for your job offer`,
              jobOfferId,
              proposal,
              senderId: socket.user.userId,
              senderName: socket.user.name || "Unknown User",
            });
            console.log(
              `Notification sent to client ${recipient._id.toString()}`
            );
          }
        }
      } catch (error) {
        console.error("Error sending job proposal notification:", error);
      }
    });


    socket.on("updateChatStatus", async ({ chatId, status }) => {
      console.log(`User ${socket.user.userId} updated chat ${chatId} status to ${status}`);

      try {
        const chat = await Chat.findByIdAndUpdate(chatId, { status }, { new: true });
        if (chat && chat.clientId && chat.providerId) {
          const recipient =
            chat.clientId._id.toString() === socket.user.userId
              ? chat.providerId
              : chat.clientId;

          const notificationMessage =
            status === "accepted"
              ? "Your chat request has been accepted"
              : "Your chat request has been rejected";

          io.to(recipient._id.toString()).emit("notification", {
            type: "chatStatusUpdate",
            message: notificationMessage,
            chatId,
            status,
          });
          console.log("Chat status update notification sent to:", recipient._id.toString());
        }
      } catch (error) {
        console.error("Error updating chat status or sending notification:", error);
      }
    });

    socket.on("disconnect", async () => {
      console.log(`User disconnected: ${socket.user?.userId}`);

      try {
        if (socket.user?.userId) {
          await User.findByIdAndUpdate(socket.user.userId, {
            isOnline: false,
            lastSeen: new Date(),
          });
          io.emit("userStatus", {
            userId: socket.user.userId,
            isOnline: false,
            lastSeen: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error("Error updating user status on disconnect:", err);
      }
    });
  });

  return io; // Retornar instancia de Socket.IO
};

module.exports = configureSocket;
