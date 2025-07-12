// ChatbotButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const ChatbotButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/chatbot')}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        fontSize: '24px',
        cursor: 'pointer',
        zIndex: 1000,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
      }}
      title="Chatbot"
    >
      💬
    </button>
  );
};

export default ChatbotButton;
