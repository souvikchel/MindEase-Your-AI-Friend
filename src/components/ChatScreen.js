import React, { useState } from "react";

function ChatScreen({ onClose }) {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi, I'm MindEase 👋 How are you feeling today?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: "user", text: input }]);
    setInput("");
    // fake bot reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "I understand. Tell me more 💙" },
      ]);
    }, 1000);
  };

  return (
    <div className="chat-screen">
      {/* Header */}
      <div className="chat-header">
        <button className="back-btn" onClick={onClose}>←</button>
        <h3>MindEase</h3>
      </div>

      {/* Messages */}
      <div className="chat-body">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-msg ${msg.from}`}>
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatScreen;
