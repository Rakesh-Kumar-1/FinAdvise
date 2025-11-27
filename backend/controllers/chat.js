import { Advisor } from "../models/advisor_details.js";
import { ChatRoom } from "../models/chatroom.js";
import { Message } from "../models/messages.js";
import { User } from "../models/user_module.js";
import { chatbot } from "./chatbot.js";
import { GoogleGenAI } from '@google/genai';
import Fuse from "fuse.js";
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({});

async function init(userQuery) {
  const simpleSystemPrompt = "You are a helpful AI assistant. Give answer only related to finanace. Please provide a clear and concise answer to the user's question.Provide answer in within 18 words.";
  try {
    const response = await openai.chat.completions.create({
      model: "openai/gpt-oss-120b:free",
      messages: [
        { role: "system", content: simpleSystemPrompt },
        { role: "user", content: userQuery },
      ],
    });
    const replyContent = response.choices[0].message.content;
    return replyContent;

  } catch (error) {
    console.error("Error calling the AI service:", error.message);
    return "Sorry, I'm having trouble connecting to the AI right now. Please try again later.";
  }
}
async function run(userQuery) {
  const response = await ai.models.generateContent({
    model: "gemma-3-27b-it",
    contents: `${userQuery}.Generate answer within 15 words`,
  });
  return (response.text);
}

export const chat = async (req, res) => {
  try {
    const { message } = req.body;
    const userMsg = message.toLowerCase().trim();
    let predefinedAnswer = null;

    // Simple keyword match
    const wordMatch = (msg, keyword) => {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    return regex.test(msg);
    };

    // Try exact keyword match
  const matchedItems = chatbot.filter((item) =>
    item.keywords.some((k) => wordMatch(userMsg, k))
  );

  if (matchedItems.length > 0) {
    predefinedAnswer = matchedItems.map((item) => item.answer).filter(Boolean).join(" ");
  } 
  // 2. If no exact match, fallback to fuzzy search
  else {
    const fuse = new Fuse(chatbot, { keys: ["keywords"], threshold: 0.3 });
    const fuzzyResults = fuse.search(userMsg);
    if (fuzzyResults.length > 0) {
      predefinedAnswer = fuzzyResults[0].item.answer;
    }
  }

  // 3. If still no answer after both attempts, set to "NOT FOUND"
  if (!predefinedAnswer) {
    const openaiAnswer = await run(message);
    predefinedAnswer = openaiAnswer;
    console.log(openaiAnswer);
  }
    return res.status(200).json({
      status: true,
      answer: predefinedAnswer,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      answer: err.message,
    });
  }
};
export const chatsidebar = async (req, res) => {
  try {
    const { id, source } = req.query;
    if (source === "advisor") {
      const chatRooms = await ChatRoom.find({ advisorId: id });

      const sidebarList = await Promise.all(
        chatRooms.map(async (room) => {
          const partner = await User.findById(room.clientId);
          return {
            chatRoomId: room._id,
            link: {
              _id: partner._id,
              name: partner.name,
              // photo: partner.photo,
            },
          };
        })
      );
      res.status(200).json(sidebarList);
    } else if (source === "client") {
      const chatRooms = await ChatRoom.find({ clientId: id });

      const sidebarList = await Promise.all(
        chatRooms.map(async (room) => {
          const partner = await Advisor.findById(room.advisorId);
          return {
            chatRoomId: room._id,
            link: {
              _id: partner._id,
              name: partner.fullname,
              // photo: partner.photo,
            },
          };
        })
      );

      res.status(200).json(sidebarList);
    }
  } catch (err) {
    console.error("Error fetching sidebar list:", err);
    res.status(500).json({ error: "Failed to fetch advisor chat list" });
  }
};
export const getMessagesByRoom = async (req, res) => {
  try {
    const { chatRoomId } = req.params;

    const chatRoom = await ChatRoom.findById(chatRoomId);
    if (!chatRoom)
      return res.status(404).json({ error: "Chat room not found" });

    // const isParticipant =
    //   chatRoom.clientId.toString() === userId ||
    //   chatRoom.advisorId.toString() === userId;
    // if (!isParticipant) {
    //   return res
    //     .status(403)
    //     .json({ error: "Unauthorized access to chat messages" });
    // }

    const messages = await Message.find({ chatRoomId }).sort({ sentAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    res.status(500).json({ error: "Error getting messages" });
  }
};
export const sendMessage = async (req, res) => {
  try {
    const { chatRoomId, senderId, receiverId, text,source } = req.body;

    const chatRoom = await ChatRoom.findById(chatRoomId);
    if (!chatRoom)
      return res.status(404).json({ error: "Chat room not found" });

    const isParticipant =
      chatRoom.clientId.toString() === senderId ||
      chatRoom.advisorId.toString() === senderId;
    if (!isParticipant) {
      return res.status(403).json({ error: "Unauthorized sender for this chat room" });
    }

    const message = await Message.create({
      chatRoomId,
      senderId,
      receiverId,
      text,
      senderModel: source === "client" ? "User" : "Advisor",
      receiverModel: source === "client" ? "Advisor" : "User",
    });

    res.status(201).json(message);
  } catch (error) {
    console.error("Message send failed:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};
