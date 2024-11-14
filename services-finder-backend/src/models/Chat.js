const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  providerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
  messages: [
    {
      text: { type: String, required: true },
      sentBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Hacer `sentBy` obligatorio
      time: { type: Date, default: Date.now },
    },
  ],
  unreadByProvider: { type: Boolean, default: false },
  unreadByClient: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);
