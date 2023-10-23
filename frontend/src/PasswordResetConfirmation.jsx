import React from "react";
import "./style.css";
import { Link } from "react-router-dom";

function PasswordResetConfirmation() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="p-3 rounded w-50 border loginForm custom-height d-flex flex-column align-items-center">
        {/* Adjusted width class to w-50 */}
        <h2 className="mt-4">Password Reset Email Sent</h2>
        <p className="confirmation-text mt-3">
          An email with instructions on how to reset your password has been sent
          to your inbox.{" "}
          <div>Please check your email and follow the instructions.</div>
        </p>
        <Link to="/login" className="btn btn-success w-25 mt-1">
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default PasswordResetConfirmation;
