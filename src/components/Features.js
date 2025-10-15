import react from "react";
import "./Features.css";

function Features() {
  return (
    <section className="features">
      <h2>Why Choose MindEase?</h2>
      <div className="feature-cards">
        <div className="card">
          <h3>24/7 Availability</h3>
          <p>Always ready to listen and respond anytime, anywhere.</p>
        </div>
        <div className="card">
          <h3>Empathetic AI</h3>
          <p>Trained on human-like emotional responses for better support.</p>
        </div>
        <div className="card">
          <h3>Private & Secure</h3>
          <p>Your conversations are encrypted and never shared.</p>
        </div>
      </div>
    </section>
  );
}

export default Features;
