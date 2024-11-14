// src/socket/socketConfig.js
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const configureSocket = (server) => {
  console.log("Configuring socket server...");

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Allow requests from your frontend
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

    User.findByIdAndUpdate(socket.user.userId, { isOnline: true })
      .exec()
      .then(() => console.log(`User ${socket.user.userId} set to online`))
      .catch((err) => console.error("Error setting user to online:", err));

    socket.on("joinChat", ({ chatId }) => {
      socket.join(chatId);
    });

    socket.on("sendMessage", ({ chatId, message }) => {
      console.log(`User ${socket.user.userId} sent a message in chat ${chatId}`);
      io.to(chatId).emit("receiveMessage", {
        message,
        senderId: socket.user.userId,
        senderType: socket.user.userType,
      });
    });

    socket.on("disconnect", async () => {
      console.log("User disconnected:", socket.user.userId);

      try {
        await User.findByIdAndUpdate(socket.user.userId, {
          isOnline: false,
          lastSeen: new Date(),
        });
        console.log(`User ${socket.user.userId} set to offline and lastSeen updated`);
      } catch (err) {
        console.error("Error updating user status on disconnect:", err);
      }
    });
  });
};

module.exports = configureSocket;
