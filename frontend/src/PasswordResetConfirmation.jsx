import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import "./stylesheets/style.css";
import { Link } from "react-router-dom";

function PasswordResetConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const successMessage = location.state?.successMessage;

  useEffect(() => {
    // Redirect if there is no success message
    if (!successMessage) {
      navigate("/"); // Redirect to login page
    }
  }, [successMessage, navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="p-3 rounded w-50 border loginForm custom-height d-flex flex-column align-items-center">
        {successMessage && <h2 className="mt-3">{successMessage}</h2>}
        <p className="confirmation-text mt-3">
          An email with instructions on how to reset your password has been sent
          to your inbox.
          <div>Please check your email and follow the instructions.</div>
        </p>
        <Link to="/" className="btn btn-success w-25 mt-3">
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default PasswordResetConfirmation;
