import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider"; // Adjust the path as needed

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;
