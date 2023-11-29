//401
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  useEffect(() => {
    document.title = "401 Unauthorized";
  }, []);
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const goBack = () => navigate(-1);

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
      background: "linear-gradient(#111, #333, #111)",
<<<<<<< HEAD
      color: "#ffffff",
    },
    h1: {
      fontSize: "128px",
      color: "#ffffff",
=======
      color: "#03dac6",
    },
    h1: {
      fontSize: "128px",
      color: "#03dac6",
>>>>>>> ba75df34aeaaefc52b8bbc4c45b1cdcd0f6e1fd9
      fontWeight: "bold",
      margin: 0,
    },
    h2: {
      fontWeight: 300,
<<<<<<< HEAD
      color: "#e0e0e0",
=======
      color: "#c8fff4",
>>>>>>> ba75df34aeaaefc52b8bbc4c45b1cdcd0f6e1fd9
      margin: "12px 0",
    },
    p: {
      fontSize: "16px",
<<<<<<< HEAD
      color: "#e0e0e0",
      marginBottom: "32px",
    },
    button: {
      background: isHovered ? "#ffffff" : "transparent",
      border: "2px solid #e0e0e0",
      color: isHovered ? "#111" : "#e0e0e0",
=======
      color: "#c8fff4",
      marginBottom: "32px",
    },
    button: {
      background: isHovered ? "#03dac6" : "transparent",
      border: "2px solid #c8fff4",
      color: isHovered ? "#111" : "#c8fff4",
>>>>>>> ba75df34aeaaefc52b8bbc4c45b1cdcd0f6e1fd9
      padding: "10px 20px",
      fontSize: "16px",
      borderRadius: "3px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
  };

  return (
    <section style={styles.container}>
      <h1 style={styles.h1}>401</h1>
      <h2 style={styles.h2}>Unauthorized</h2>
      <br />
      <p style={styles.p}>You do not have access to the requested page.</p>
      <div className="flexGrow">
        <button
          style={styles.button}
          onMouseOver={() => setIsHovered(true)}
          onMouseOut={() => setIsHovered(false)}
          onClick={goBack}
        >
          Go Back
        </button>
      </div>
    </section>
  );
};

export default Unauthorized;
