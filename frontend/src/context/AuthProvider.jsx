import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const localAuth = localStorage.getItem("auth");
    return localAuth ? JSON.parse(localAuth) : {};
  });

  const setAuthData = (data) => {
    setAuth(data); // Update React state
    localStorage.setItem("auth", JSON.stringify(data)); // Persist to localStorage
  };

  const logout = () => {
    setAuth({}); // Clear React state
    localStorage.removeItem("auth"); // Clear localStorage
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, setAuthData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
