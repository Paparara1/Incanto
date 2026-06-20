import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

export default function Chat() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Cześć! Jestem Inkanto, Twój osobisty asystent AI. W czym mogę Ci dzisiaj pomóc?" }
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("inkanto_user");
    if (!savedUser) {
      navigate("/");
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const userMessage = { role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const userData = JSON.parse(localStorage.getItem("inkanto_user") || "{}");
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userData.credential}`
        },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        }),
      });

      if (!response.ok) throw new Error("Błąd komunikacji z AI");

      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.content }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Przepraszam, wystąpił błąd podczas łączenia z moim mózgiem. Upewnij się, że klucz API jest poprawnie skonfigurowany."
      }]);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{
        width: "100vw", height: "100vh", background: "#0f0c29",
        display: "flex", alignItems: "center", justifyContent: "center", color: "white"
      }}>
        Ładowanie...
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      background: "linear-gradient(135deg, #0f0c29, #1a1a2e)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      color: "white"
    }}>
      {/* Header */}
      <div style={{
        padding: "15px 25px",
        background: "rgba(26, 26, 46, 0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(167, 139, 250, 0.2)",
        backdropFilter: "blur(10px)",
        zIndex: 10
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "35px", height: "35px", borderRadius: "50%",
            background: "linear-gradient(135deg, #a78bfa, #7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.2rem", boxShadow: "0 0 15px rgba(167, 139, 250, 0.4)"
          }}>✨</div>
          <span style={{ fontWeight: "700", fontSize: "1.1rem", letterSpacing: "0.5px" }}>Inkanto AI</span>
        </div>
        <Link
          to="/"
          style={{
            color: "#9ca3af", textDecoration: "none", fontSize: "0.9rem",
            padding: "8px 16px", borderRadius: "20px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            transition: "all 0.2s"
          }}
        >
          ← Powrót
        </Link>
      </div>

      {/* Messages Area */}
      <div style={{
        flexGrow: 1,
        overflowY: "auto",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        maxWidth: "800px",
        width: "100%",
        margin: "0 auto",
        scrollbarWidth: "thin",
        scrollbarColor: "#4b5563 transparent"
      }}>
        {messages.map((msg, index) => (
          <div key={index} style={{
            alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
            maxWidth: "85%",
            display: "flex",
            flexDirection: "column",
            gap: "5px"
          }}>
            <div style={{
              padding: "12px 18px",
              borderRadius: msg.role === "user" ? "20px 20px 0 20px" : "20px 20px 20px 0",
              background: msg.role === "user" ? "#7c3aed" : "rgba(255, 255, 255, 0.07)",
              color: "white",
              lineHeight: "1.5",
              fontSize: "1rem",
              boxShadow: msg.role === "user" ? "0 4px 15px rgba(124, 58, 237, 0.3)" : "none",
              border: msg.role === "user" ? "none" : "1px solid rgba(255, 255, 255, 0.1)"
            }}>
              {msg.content}
            </div>
            <span style={{
              fontSize: "0.7rem",
              color: "#6b7280",
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              margin: "0 5px"
            }}>
              {msg.role === "assistant" ? "Inkanto" : "Ty"}
            </span>
          </div>
        ))}
        {isSending && (
          <div style={{ alignSelf: "flex-start", display: "flex", gap: "8px", padding: "10px" }}>
             <div className="dot" style={{ width: "8px", height: "8px", background: "#a78bfa", borderRadius: "50%", animation: "pulse 1.5s infinite" }}></div>
             <div className="dot" style={{ width: "8px", height: "8px", background: "#a78bfa", borderRadius: "50%", animation: "pulse 1.5s infinite 0.2s" }}></div>
             <div className="dot" style={{ width: "8px", height: "8px", background: "#a78bfa", borderRadius: "50%", animation: "pulse 1.5s infinite 0.4s" }}></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        padding: "20px",
        background: "rgba(26, 26, 46, 0.8)",
        borderTop: "1px solid rgba(167, 139, 250, 0.1)",
        backdropFilter: "blur(10px)"
      }}>
        <form
          onSubmit={handleSend}
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            display: "flex",
            gap: "10px",
            position: "relative"
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Napisz do Inkanto..."
            style={{
              flexGrow: 1,
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(167, 139, 250, 0.3)",
              borderRadius: "30px",
              padding: "14px 25px",
              color: "white",
              fontSize: "1rem",
              outline: "none",
              transition: "border-color 0.2s"
            }}
            onFocus={(e) => e.target.style.borderColor = "#a78bfa"}
            onBlur={(e) => e.target.style.borderColor = "rgba(167, 139, 250, 0.3)"}
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            style={{
              background: input.trim() ? "linear-gradient(135deg, #a78bfa, #7c3aed)" : "#374151",
              border: "none",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: input.trim() ? "pointer" : "default",
              transition: "transform 0.2s, background 0.2s",
              boxShadow: input.trim() ? "0 4px 15px rgba(124, 58, 237, 0.4)" : "none"
            }}
            onMouseOver={(e) => input.trim() && (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
