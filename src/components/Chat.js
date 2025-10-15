import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Chat.css";

function Chat({ onBack, firstOpen = true }) {
  const [messages, setMessages] = useState([
    { role: "model", text: "👋 Hi! How can I help you today?" }
  ]);

  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("en-US");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const firstRenderRef = useRef(firstOpen);

  // ✅ Use Render backend URL
  const API_BASE_URL = "https://mindease-your-ai-friend.onrender.com";

  // --- Send Message ---
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");

    setIsTyping(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/chat`, {
        userMessage: input,
      });

      const botReply = res.data.reply || "🤖 Sorry, I could not respond.";

      setTimeout(() => {
        setMessages((prev) => [...prev, { role: "model", text: botReply }]);
        setIsTyping(false);
      }, 1500);
    } catch (error) {
      console.error("Frontend Error:", error.message);
      setMessages([
        ...updatedMessages,
        { role: "model", text: "⚠️ Error connecting to server." },
      ]);
      setIsTyping(false);
    }
  };

  // --- Voice Input ---
  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onerror = (e) => {
      console.error("Speech Recognition Error:", e.error);
    };

    recognition.start();
  };

  // --- Scroll on new message ---
  useEffect(() => {
    if (!firstRenderRef.current) {
      const chatBox = chatEndRef.current?.parentNode;
      if (chatBox) {
        chatBox.scrollBy({
          top: 100,
          behavior: "smooth",
        });
      }
    } else {
      firstRenderRef.current = false;
    }
  }, [messages, isTyping]);

  return (
    <div className="chat-container">
      <button onClick={onBack} className="back-btn" title="Back">
        ←
      </button>

      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === "user" ? "user" : "bot"}>
            <span>{msg.text}</span>
          </div>
        ))}

        {isTyping && (
          <div className="bot typing-indicator">
            MindEase is typing<span className="dots"></span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="input-controls">
        <select onChange={(e) => setLanguage(e.target.value)} value={language}>
          <option value="en-US">English</option>
          <option value="hi-IN">Hindi</option>
          <option value="gu-IN">Gujarati</option>
          <option value="bn-IN">Bengali</option>
          <option value="ta-IN">Tamil</option>
          <option value="te-IN">Telugu</option>
        </select>

        <div className="input-area">
          <input
            type="text"
            value={input}
            placeholder="Type or speak..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend}>Send</button>
          <button onClick={handleVoiceInput}>🎤</button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
