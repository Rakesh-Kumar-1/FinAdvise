import React, { useState } from "react";
import axios from "axios";
import "../../CSS/ChatBot.css" // CSS in next step

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMsg = { text: input, sender: "user" };
    setMessages(prev => [...prev, userMsg]);

    try {
      // Call backend
      const res = await axios.post("http://localhost:8080/chat", {
        message: input,
      });

      const botMsg = { text: res.data.answer, sender: "bot" };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
        console.error(err);
      const errMsg = { text: "Sorry, something went wrong.", sender: "bot" };
      setMessages(prev => [...prev, errMsg]);
    }

    setInput("");
  };

  return (
    <div className="chatbot-container">
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === "user" ? "left" : "right"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask something..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatBot;