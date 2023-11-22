import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./stylesheets/style.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [backendErrors, setBackendErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBackendErrors([]);
    setSuccessMessage("");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/forget-password",
        { email }
      );
      // Handle success response
      navigate("/resetPass", { state: { successMessage: response.data.msg } });
    } catch (error) {
      if (error.response) {
        // If the backend sends an array of errors
        if (error.response.data.errors) {
          setBackendErrors(error.response.data.errors);
        } else {
          // If the backend sends a single error message
          setBackendErrors([{ msg: error.response.data.msg }]);
        }
      } else {
        // Handle other errors like network errors
        setBackendErrors([{ msg: "Network error or server not responding." }]);
      }
    }
  };

  return (
    <div className="loginPage">
      <div className="loginForm">
        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}
        {backendErrors.length > 0 && (
          <div className="alert alert-danger" role="alert">
            {backendErrors.map((error, index) => (
              <div key={index}>{error.msg}</div>
            ))}
          </div>
        )}
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              <strong>Email Address</strong>
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter Email Address"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-success w-100 rounded-0 mb-3"
          >
            Send Reset Password Link
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="btn btn-light w-100 mb-2"
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
