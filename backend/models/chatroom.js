import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  advisorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Advisor',
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);

