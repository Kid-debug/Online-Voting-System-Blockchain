import React, { useState } from "react";
import "./stylesheets/style.css";
import axios from "axios";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [backendErrors, setBackendErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setBackendErrors([]);
    setSuccessMessage(""); // Reset success message on new submission

    try {
      const response = await axios.get(
        "http://localhost:3000/resetPasswordLoad",
        {
          password,
          confirmPassword,
        }
      );
      // Handle successful registration here.
      setSuccessMessage(response.data.msg); // Set the success message to state
      // Optionally, redirect user or handle the success case further...
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
        // Handle other errors here
        console.error("Reset Password error:", error);
        setBackendErrors([
          { msg: "Network error occurred. Please refresh your page!" },
        ]);
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="p-3 rounded w-25 border loginForm">
        <h2>Reset Password</h2>
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
        <form onSubmit={handleResetPassword}>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              className="form-control rounded-0"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password-confirm">
              <strong>Confirm Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter Confirm Password"
              name="password-confirm"
              className="form-control rounded-0"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 rounded-0 mb-3"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;