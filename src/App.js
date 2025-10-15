import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Chat from "./components/Chat";
import Features from "./components/Features";
import Timeline from "./components/Timeline";
import Footer from "./components/Footer";
import About from "./components/About";
import Contact from "./components/Contact";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <div className="transparent-layout">
        <Navbar />
        <Hero />
        <Features />
        <Timeline />
        <About/>
        <Contact />
        <Footer />
        
        {/* Chat will appear here when started */}
        {/* <Chat /> */}
      </div>
    </div>
  );
}

export default App;

