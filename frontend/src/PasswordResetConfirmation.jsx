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
    <div className="loginPage">
      <div className="loginForm">
        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}
        <p className="confirmation-text mt-3">
          An email with instructions on how to reset your password has been sent
          to your inbox. Please check your email and follow the instructions.
        </p>
        <Link to="/" className="btn btn-success w-100 mb-2">
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default PasswordResetConfirmation;
