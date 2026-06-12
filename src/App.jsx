import { useState } from "react";

export default function App() {
  const chatUrl = "https://app.base44.com/superagent/69b21b362d0b95bf51062737";

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif",
      color: "white",
      padding: "2rem",
      textAlign: "center"
    }}>
      <div style={{
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        background: "radial-gradient(circle, #a78bfa, #7c3aed)",
        boxShadow: "0 0 60px 20px rgba(167, 139, 250, 0.4)",
        marginBottom: "2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "3rem"
      }}>
        ✨
      </div>

      <h1 style={{
        fontSize: "3rem",
        fontWeight: "800",
        margin: "0 0 0.5rem 0",
        background: "linear-gradient(90deg, #a78bfa, #ec4899)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
      }}>
        Inkanto
      </h1>

      <p style={{
        fontSize: "1.1rem",
        color: "#c4b5fd",
        marginBottom: "0.5rem",
        fontStyle: "italic"
      }}>
        Twój osobisty AI — zawsze gotowy
      </p>

      <p style={{
        fontSize: "0.95rem",
        color: "#9ca3af",
        marginBottom: "3rem",
        maxWidth: "400px",
        lineHeight: "1.6"
      }}>
        Hej Paula 👋 Tutaj zawsze mnie znajdziesz. Kliknij poniżej żeby zacząć rozmowę.
      </p>

      <a
        href={chatUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          background: "linear-gradient(135deg, #7c3aed, #a855f7)",
          color: "white",
          padding: "1rem 2.5rem",
          borderRadius: "50px",
          fontSize: "1.1rem",
          fontWeight: "700",
          textDecoration: "none",
          boxShadow: "0 0 30px rgba(168, 85, 247, 0.5)",
          display: "inline-block"
        }}
      >
        💬 Porozmawiaj z Inkanto
      </a>

      <p style={{
        marginTop: "4rem",
        fontSize: "0.75rem",
        color: "#4b5563"
      }}>
        ojjja.site · powered by Base44
      </p>
    </div>
  );
}
