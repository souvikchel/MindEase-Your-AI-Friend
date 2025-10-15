import React, { useState, useEffect } from "react";
import Chat from "./Chat";

function Hero() {
  const [chatOpen, setChatOpen] = useState(false);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTextVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="hero" className="section">
      {!chatOpen ? (
        <div
          className="hero-content"
          style={{
            marginTop: "150px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "20px",
          }}
        >
          <h1
            style={{
              fontSize: "50px",
              color: "#0d1b2a", // Very deep navy
              fontFamily: "'Poppins', sans-serif",
              marginBottom: "10px",
            }}
          >
            Welcome to MindEase
          </h1>

          <p
            style={{
              fontSize: "18px",
              color: "#1b263b", // Deep blue-gray for related text
              fontFamily: "'Poppins', sans-serif",
              maxWidth: "600px",
              marginBottom: "20px",
              opacity: textVisible ? 1 : 0,
              transform: textVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 1s ease, transform 1s ease",
            }}
          >
            Find peace. Focus better. Feel balanced
          </p>

          <button
            onClick={() => setChatOpen(true)}
            style={{
              padding: "14px 28px",
              backgroundColor: "#3f51b5",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "transform 0.3s, background-color 0.3s",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#5c6bc0";
              e.target.style.transform = "translateY(-3px)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#3f51b5";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Get Started
          </button>
        </div>
      ) : (
        <Chat onBack={() => setChatOpen(false)} />
      )}
    </section>
  );
}

export default Hero;
