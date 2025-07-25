import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    // ref: 'user', // or 'Client' if clients have a separate collection
    // required: true
  },
  advisorId: {
    type: mongoose.Schema.Types.ObjectId,
    // ref: 'Advisor', // or 'Advisor' if advisors have a separate collection
    // required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);
