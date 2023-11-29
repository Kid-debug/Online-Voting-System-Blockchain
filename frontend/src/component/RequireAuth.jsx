import React, { useContext, useEffect, useRef } from "react";
import { useLocation, Navigate, Outlet, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import axios from "axios";

const RequireAuth = ({ allowedRoles }) => {
  const effectRan = useRef(false);
  const { auth, logout } = useContext(AuthContext);
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  useEffect(() => {
    // Variation #1
    if (auth?.accessToken && effectRan.current === false) {
      const verifyToken = async () => {
        try {
          const response = await axiosPrivate.get("/api/verifyToken");
          console.log("Token is valid:", response.data);
          // Token is valid, proceed with rendering
        } catch (error) {
          if (error.response) {
            if (error.response?.status === 403) {
              console.error("Token has expired:", error.response.data);
              alert("Your token has expired. Please log in again.");
              try {
                // Attempt to logout
                await axios.get("http://localhost:3000/api/logout", {
                  withCredentials: true,
                });
                logout();
                navigate("/");
              } catch (logoutError) {
                console.error(
                  "Logout failed during token verification",
                  logoutError
                );
              }
              // Redirect to login page after logout
              return <Navigate to="/" state={{ from: location }} replace />;
            } else {
              console.error("Error verifying token:", error.response.data);
              // Handle other possible errors
            }
          } else if (error.request) {
            // The request was made but no response was received
            console.error("No response received:", error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Error:", error.message);
          }
        }
      };
      verifyToken();
      return () => {
        effectRan.current = true;
      };
    }
  }, []);

  if (!auth?.accessToken) {
    return <Navigate to="/" state={{ from: location }} replace />;
  } else if (allowedRoles && !allowedRoles.includes(auth?.userRole)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
