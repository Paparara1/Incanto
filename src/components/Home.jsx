import { Link } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

  useEffect(() => {
    const savedUser = localStorage.getItem("inkanto_user");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        if (userData.credential) {
          const decoded = jwtDecode(userData.credential);
          setUser({ ...userData, name: decoded.given_name || decoded.name });
        } else {
          setUser(userData);
        }
        setIsAuthenticated(true);
      } catch (e) {
        console.error("Error parsing user data", e);
        localStorage.removeItem("inkanto_user");
      }
    }
  }, []);

  const handleSuccess = (credentialResponse) => {
    console.log("Login Success");
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const userData = {
        loggedIn: true,
        timestamp: Date.now(),
        credential: credentialResponse.credential,
        name: decoded.given_name || decoded.name
      };
      localStorage.setItem("inkanto_user", JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
    } catch (e) {
      console.error("Error decoding token", e);
    }
  };

  const handleError = () => {
    console.log("Login Failed");
  };

  const handleLogout = () => {
    localStorage.removeItem("inkanto_user");
    setIsAuthenticated(false);
    setUser(null);
  };

  if (!clientId) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#0f0c29",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        textAlign: "center"
      }}>
        <div>
          <h2 style={{ color: "#f87171" }}>Błąd konfiguracji</h2>
          <p>Brakuje VITE_GOOGLE_CLIENT_ID w pliku .env</p>
          <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>Ustaw identyfikator klienta Google Cloud, aby włączyć logowanie.</p>
        </div>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
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
          {isAuthenticated && user?.name ? `Witaj, ${user.name}! 👋` : "Zaloguj się przez Google, aby porozmawiać z Inkanto."}
        </p>

        {!isAuthenticated ? (
          <div style={{ marginBottom: "2rem" }}>
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              useOneTap
              theme="filled_blue"
              shape="pill"
            />
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <Link
              to="/chat"
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
            </Link>
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                border: "none",
                color: "#9ca3af",
                cursor: "pointer",
                fontSize: "0.9rem",
                textDecoration: "underline"
              }}
            >
              Wyloguj się
            </button>
          </div>
        )}

        <p style={{
          marginTop: "4rem",
          fontSize: "0.75rem",
          color: "#4b5563"
        }}>
          ojjja.site · powered by Base44
        </p>
      </div>
    </GoogleOAuthProvider>
  );
}
