import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Missing = () => {
  useEffect(() => {
    document.title = "404 Page Not Found";
  }, []);

  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const goLogin = () => navigate("/");

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      fontFamily: "Roboto, sans-serif",
      height: "100vh",
      margin: 0,
      padding: 0,
      background: "linear-gradient(#1a1a1a, #333, #1a1a1a)",
      color: "#f5f5f5",
    },
    h1: {
      fontSize: "128px",
      color: "#e57373",
      fontWeight: "bold",
      margin: 0,
    },
    h2: {
      fontWeight: 300,
      color: "#f5f5f5",
      margin: "18px 0",
    },
    p: {
      fontSize: "16px",
      color: "#f5f5f5",
      marginBottom: "32px",
    },
    button: {
      background: isHovered ? "#e57373" : "transparent",
      border: "2px solid #f5f5f5",
      color: isHovered ? "#111" : "#f5f5f5",
      padding: "10px 20px",
      fontSize: "16px",
      borderRadius: "3px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
  };

  return (
    <section style={styles.container}>
      <h1 style={styles.h1}>404</h1>
      <h2 style={styles.h2}>Page Not Found</h2>
      <p style={styles.p}>The page you are looking for does not exist.</p>
      <p style={styles.p}>Please navigate back to the login page.</p>
      <div className="flexGrow">
        <button
          style={styles.button}
          onMouseOver={() => setIsHovered(true)}
          onMouseOut={() => setIsHovered(false)}
          onClick={goLogin}
        >
          Go To Login Page
        </button>
      </div>
    </section>
  );
};

export default Missing;
