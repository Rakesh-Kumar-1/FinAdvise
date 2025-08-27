import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  chatRoomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatRoom",
    required: true,
    index: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "senderModel"
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "receiverModel",
  },
  senderModel: {
    type: String,
    enum: ["User", "Advisor"],
    required: true
  },
  receiverModel: {
    type: String,
    enum: ["User", "Advisor"],
    required: true
  },
  text: {
    type: String,
    maxlength: 200,
    required: true
  },
  status: {
    type: String,
    enum: ["sent", "delivered", "seen"],
    default: "sent"
  },
  sentAt: {
    type: Date,
    default: Date.now
  }
});

export const Message = mongoose.model("Message", messageSchema);
