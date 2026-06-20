import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Chat() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const chatUrl = "https://app.base44.com/superagent/69b21b362d0b95bf51062737";

  useEffect(() => {
    const savedUser = localStorage.getItem("inkanto_user");
    if (!savedUser) {
      navigate("/");
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [navigate]);

  if (isLoading) {
    return (
      <div style={{
        width: "100vw",
        height: "100vh",
        background: "#0f0c29",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white"
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
      background: "#0f0c29",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }}>
      <div style={{
        padding: "10px 20px",
        background: "rgba(36, 36, 62, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(167, 139, 250, 0.2)",
        zIndex: 10
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "1.2rem" }}>✨</span>
          <span style={{ fontWeight: "bold", color: "#a78bfa" }}>Inkanto Chat</span>
        </div>
        <Link
          to="/"
          style={{
            color: "#9ca3af",
            textDecoration: "none",
            fontSize: "0.9rem",
            padding: "5px 12px",
            borderRadius: "4px",
            background: "rgba(255, 255, 255, 0.05)",
            transition: "all 0.2s"
          }}
          onMouseOver={(e) => e.target.style.background = "rgba(255, 255, 255, 0.1)"}
          onMouseOut={(e) => e.target.style.background = "rgba(255, 255, 255, 0.05)"}
        >
          ← Powrót
        </Link>
      </div>
      <iframe
        src={chatUrl}
        style={{
          width: "100%",
          flexGrow: 1,
          border: "none",
        }}
        title="Inkanto Chat"
        allow="microphone"
      />
    </div>
  );
}
