import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const sessionAuth = sessionStorage.getItem("auth");
    return sessionAuth ? JSON.parse(sessionAuth) : {};
  });

  const setAuthData = (data) => {
    setAuth(data); // Update React state
    sessionStorage.setItem("auth", JSON.stringify(data)); // Persist to sessionStorage
  };

  const logout = () => {
    setAuth({}); // Clear React state
    sessionStorage.removeItem("auth"); // Clear sessionStorage
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, setAuthData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
