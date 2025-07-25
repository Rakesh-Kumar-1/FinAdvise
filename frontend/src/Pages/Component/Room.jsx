import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:8080";

export const Room = () => {
  const [partner, setPartner] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const location = useLocation();
  const { positionId, source } = location.state || {};

  const socket = useRef();

  // 👉 Connect to socket on mount
  useEffect(() => {
    socket.current = io(SOCKET_SERVER_URL);

    socket.current.on("connect", () => {
      console.log("Connected to socket.io server");
    });

    // Receive message from socket
    socket.current.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const fetchChatRooms = async () => {
    try {
//    const response = await axios.get(`http://localhost:8080/chat/chatroom/${id}`);
      const response = await axios.get(`http://localhost:8080/chat/chatroom?id=${positionId}&source=${source}`);

      setPartner(response.data);
    } catch (error) {
      console.error("Sidebar load failed:", error);
    }
  };

  const fetchMessages = async (chatRoomId) => {
    try {
      const res = await axios.get(`http://localhost:8080/chat/messages/${chatRoomId}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  useEffect(() => {
    fetchChatRooms();
  }, [positionId]);

  const onSelectChat = async (chatRoomId, partnerId) => {
    await fetchMessages(chatRoomId);
    setSelectedChat({ chatRoomId, partnerId });

    // 👉 Join socket room
    socket.current.emit("join_room", chatRoomId);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const { chatRoomId, partnerId } = selectedChat;

    const messageData = {
      chatRoomId,
      senderId: positionId,
      receiverId: partnerId,
      text: newMessage
    };

    try {
      // 1️⃣ Save to database
      await axios.post("http://localhost:8080/chat/messages", messageData);

      // 2️⃣ Emit via socket
      socket.current.emit("send_message", messageData);

      // 3️⃣ Add to current view
      setMessages((prev) => [...prev, messageData]);
      setNewMessage("");
    } catch (error) {
      console.error("Sending message failed:", error);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div className="chat-sidebar" style={{ width: "30%", padding: "1rem" }}>
        <h3>Your {source}</h3>
        {partner.length === 0 ? (
          <p>No active chats yet.</p>
        ) : (
          partner.map(({ chatRoomId, link }) => (
            <div
              key={chatRoomId}
              className="chat-contact"
              onClick={() => onSelectChat(chatRoomId, link._id)}
              style={{
                cursor: "pointer",
                padding: "10px",
                borderBottom: "1px solid #ccc",
                background: selectedChat?.chatRoomId === chatRoomId ? "#eee" : "transparent",
              }}
            >
              <strong>{link.name}</strong>
            </div>
          ))
        )}
      </div>

      {/* Chat Area */}
      <div className="chat-rightbar" style={{ width: "70%", padding: "1rem" }}>
        <h2>Chat Section</h2>
        <div
          className="message-inbox"
          style={{
            minHeight: "300px",
            border: "1px solid #ccc",
            padding: "1rem",
            marginBottom: "1rem",
            overflowY: "auto",
            backgroundColor: "#f9f9f9"
          }}
        >
          {messages.length === 0 ? (
            <p>Select a chat to view messages</p>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  textAlign: msg.senderId === positionId ? "left" : "right",
                  marginBottom: "10px"
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    background: msg.senderId === positionId ? "#e0f7fa" : "#d1ffd6",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    maxWidth: "60%",
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))
          )}
        </div>

        {selectedChat && (
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              value={newMessage}
              maxLength={60}
              onChange={(e) => setNewMessage(e.target.value)}
              style={{ flex: 1, padding: "0.5rem" }}
              placeholder="Type a message..."
              required
            />
            <button onClick={handleSendMessage} style={{ padding: "0.5rem 1rem" }}>
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
