const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  portfolioId: { type: mongoose.Schema.Types.ObjectId, ref: "Portfolio", required: true },
  messages: [
    {
      text: String,
      sentBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      time: { type: Date, default: Date.now },
    },
  ],
  unreadByProvider: { type: Boolean, default: true },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
});

module.exports = mongoose.model("Chat", chatSchema);
