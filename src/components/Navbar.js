import React from "react";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      {/* Logo Image beside MindEase text */}
      <div className="logo" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <img
          src={`/logo.jpeg`}
          alt="MindEase Logo"
          style={{ height: "30px", width: "30px" }} // small logo
        />
        <span>MindEase</span>
      </div>

      <ul className="nav-links">
        <li><a href="#hero">Home</a></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#timeline">Timeline</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
