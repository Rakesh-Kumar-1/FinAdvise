import { Advisor } from "../models/advisor_details.js";
import { ChatRoom } from "../models/chatroom.js";
import { Message } from "../models/messages.js";
import { User } from "../models/user_module.js";
import { chatbot } from "./chatbot.js";
import fs from "fs";
import path from "path";
import Fuse from "fuse.js";

export const chat = async (req, res) => {
  try {
    const { message } = req.body;
    const userMsg = message.toLowerCase().trim();

    // Simple keyword match
    const wordMatch = (msg, keyword) => {
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // escape special characters
      const regex = new RegExp(`\\b${escaped}\\b`, "i");
      return regex.test(msg);
    };

    // Try exact keyword match
    const matchedItems = chatbot.filter((item) =>
      item.keywords.some((k) => wordMatch(userMsg, k))
    );

    if (matchedItems.length > 0) {
      const answers = matchedItems.map((item) => item.answer).filter(Boolean); // remove any undefined or null answers

      const combinedAnswer = answers.join(" ");

      return res.status(200).json({
        status: true,
        answer: combinedAnswer || "Sorry, I couldn't find a proper response.",
      });
    }

    // Fallback: Fuzzy search
    const fuse = new Fuse(chatbot, {
      keys: ["keywords"],
      threshold: 0.3,
    });

    const fuzzyResults = fuse.search(userMsg);
    if (fuzzyResults.length > 0) {
      return res
        .status(200)
        .json({ status: true, answer: fuzzyResults[0].item.answer });
    }

    // Log unmatched message
    const logEntry = { message, timestamp: new Date().toISOString() };
    const logDir = "logs";
    const logFile = path.join(logDir, "unmatched.json");

    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + "\n");

    return res
      .status(200)
      .json({
        status: true,
        answer: "Sorry, I didn't understand. Could you rephrase?",
      });
  } catch (err) {
    return res.status(500).json({ status: false, answer: err.message });
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
      res.json(sidebarList);
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

      res.json(sidebarList);
    }
  } catch (err) {
    console.error("Error fetching sidebar list:", err);
    res.status(500).json({ error: "Failed to fetch advisor chat list" });
  }
};
export const getMessagesByRoom = async (req, res) => {
  try {
    const { chatRoomId } = req.params;
    // const { userId } = req.query;

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
    const { chatRoomId, senderId, receiverId, text } = req.body;

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
