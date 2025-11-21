import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "https://finadvise-backend.onrender.com";

export const Room = () => {
  const [partner, setPartner] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  const location = useLocation();
  const { positionId, source } = location.state || {};
  const socket = useRef(null);

  // 🔌 Connect socket and manage message listener
  useEffect(() => {
    const socketInstance = io(SOCKET_SERVER_URL);
    socket.current = socketInstance;

    const handleReceiveMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socketInstance.on("connect", () => {
    console.log("✅ Connected to socket.io server");
    socketInstance.emit("identify", { userId: positionId }); // Add this line
    });

    socketInstance.on("receiveMessage", handleReceiveMessage);

    return () => {
      socketInstance.off("receiveMessage", handleReceiveMessage);
      socketInstance.disconnect();
      console.log("🛑 Disconnected from socket");
    };
  }, []);

  // 📡 Fetch chat rooms on user change
  useEffect(() => {
    const fetchChatRooms = async () => {
      try {                                               // ChatSideBar
        const response = await axios.get(
          `https://finadvise-backend.onrender.com/chat/chatroom?id=${positionId}&source=${source}`
        );
        setPartner(response.data);
        setMessages([]);
        setSelectedChat(null);
      } catch (error) {
        console.error("Sidebar load failed:", error);
      }
    };

    if (positionId && source) {
      fetchChatRooms();
    }
  }, []);

  // 📨 Fetch messages when chat selected
  const onSelectChat = async (chatRoomId, partnerId) => {
    try {
      const res = await axios.get(`https://finadvise-backend.onrender.com/chat/messages/${chatRoomId}`);  //getMessageByRoom
      setMessages(res.data);
      setSelectedChat({ chatRoomId, partnerId });

      socket.current.emit("join_room", {
      chatRoomId,
      userId: positionId,
    });

    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  // ✉️ Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const { chatRoomId, partnerId } = selectedChat;

    const messageData = {
      chatRoomId,
      senderId: positionId,
      receiverId: partnerId,
      text: newMessage,
      source,
    };

    try {
      await axios.post("https://finadvise-backend.onrender.com/chat/sendmessages", messageData);
      socket.current.emit("send_message", messageData);
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
            backgroundColor: "#f9f9f9",
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
                  marginBottom: "10px",
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
