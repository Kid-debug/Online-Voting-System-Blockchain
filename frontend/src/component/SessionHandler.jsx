// SessionHandler.jsx
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider"; 

const SessionHandler = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;

    if (auth?.sessionExpiryTime) {
      const timeLeft = auth.sessionExpiryTime - Date.now();

      if (timeLeft > 0) {
        // Session is valid, set a timeout to automatically logout when session expires
        timer = setTimeout(() => {
          alert("Your session has expired. Please log in again.");
          logout();
          navigate("/");
        }, timeLeft);
      } else {
        // Session has already expired
        logout();
        navigate("/");
      }
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [auth, logout, navigate]);

  // This component does not render anything, it just manages the session
  return null;
};

export default SessionHandler;
