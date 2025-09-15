import { Advisor } from "../models/advisor_details.js";
import { ChatRoom } from "../models/chatroom.js";
import { Message } from "../models/messages.js";
import { User } from "../models/user_module.js";
import { chatbot } from "./chatbot.js";
import OpenAI from "openai";
import Fuse from "fuse.js";
import fs from "fs";
import path from "path";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: "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",
});

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

const SYSTEM_PROMPT = `
You are an AI assistant specialized in farming and agriculture.
Your goal is to provide the best possible advice and solutions related to farming, crops, soil, irrigation, fertilizers, pest management, livestock, and agricultural technologies.

Workflow:
- START: The user gives a query related to farming or agriculture.
- THINK: You must carefully think through the query at least 3 times (THINK, THINK, THINK). 
          In each step, refine your reasoning to ensure the answer is practical, safe, and useful for farmers. 
- OUTPUT: Finally, provide the best farming/agriculture solution in clear and simple language.

Rules:
- Always output strictly in JSON format.
- Each step must be output separately (one JSON object per step).
- Use at least 3 THINK steps before giving OUTPUT.
- No tool calling is allowed (only reasoning and final text-based solution).
- Keep answers fact-based, practical, and farmer-friendly.

Example:
START: "What fertilizer should I use for wheat in loamy soil?"
THINK: "The user is asking about fertilizer recommendation for wheat in loamy soil."
THINK: "Wheat in loamy soil generally needs nitrogen, phosphorus, and potassium. The common NPK ratio is important."
THINK: "A balanced fertilizer like 120:60:40 NPK per hectare is often recommended, along with urea for nitrogen."
OUTPUT: "For wheat in loamy soil, use a fertilizer plan of about 120 kg Nitrogen, 60 kg Phosphorus, and 40 kg Potassium per hectare. Apply urea in split doses for better results."

Output Format:
{"role":"user","content":"User query here"}
{"step":"think","content":"First level reasoning"}
{"step":"think","content":"Second level reasoning"}
{"step":"think","content":"Third level reasoning"}
{"step":"output","content":"Final farming/agriculture advice in simple text"}
`;

async function init(userQuery) {
  await sleep(1000);

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userQuery },
  ];

  while (true) {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });

    const replyContent = response.choices[0].message.content;

    // Add assistant reply to conversation
    messages.push({ role: "assistant", content: replyContent });

    let parsed_response;
    try {
      parsed_response = JSON.parse(replyContent);
    } catch (e) {
      console.error("Failed to parse JSON:", replyContent);
      return "Sorry, I couldn’t process the response correctly.";
    }

    if (parsed_response.step === "think") {
      continue;
    }
    if (parsed_response.step === "output") {
      console.log(`Output --- ${parsed_response.content}`);
      return parsed_response.content;
    }
  }
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

    // Fallback: Fuzzy search
    const fuse = new Fuse(chatbot, { keys: ["keywords"], threshold: 0.3 });
    const fuzzyResults = fuse.search(userMsg);
    if (fuzzyResults.length > 0) {
        predefinedAnswer = fuzzyResults[0].item.answer;
    }

    // Call OpenAI
    const openaiAnswer = await init(message);
    console.log(openaiAnswer);
    if(!predefinedAnswer){
      predefinedAnswer = openaiAnswer;
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
