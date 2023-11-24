import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Missing = () => {
  useEffect(() => {
    document.title = "404 Page Not Found";
  }, []);
  const styles = {
    body: {
      textAlign: "center",
      backgroundColor: "#fcfefb",
    },
    fourZeroFourBg: {
      marginTop: "-80px",
      backgroundImage:
        'url("https://media.tenor.com/mHN7u3KLMysAAAAC/arknights-error.gif")',
      height: "550px",
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
    },
    fourZeroFour: {
      marginTop: "30px",
    },
    pageNotFound: {
      marginTop: "-40px",
    },
    h1: {
      fontSize: "80px",
      fontWeight: "bold",
      color: "#333",
    },
    h2: {
      fontSize: "40px",
      fontWeight: "bold",
      color: "#555",
    },
    p: {
      fontSize: "20px",
      color: "#555",
      marginTop: "20px",
    },
    link: {
      color: "#ffffff",
      backgroundColor: "#39ac31",
      padding: "10px 20px",
      textDecoration: "none",
      display: "inline-block",
      marginTop: "5px",
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.fourZeroFour}>
        <h1 style={styles.h1}>404</h1>
      </div>
      <div style={styles.fourZeroFourBg}></div>
      <div style={styles.pageNotFound}>
        <h2 style={styles.h2}>Page Not Found</h2>
        <p style={styles.p}>The page you are looking for does not exist.</p>
        <p style={styles.p}>Please navigate back to the login page.</p>
        <div style={{ flexGrow: 1 }}>
          <Link to="/" style={styles.link}>
            Go To Login Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Missing;
