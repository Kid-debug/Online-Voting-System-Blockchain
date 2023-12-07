import React, { useState, useEffect } from "react";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import "./stylesheets/style.css";
import axios from "./api/axios";
import { Link, useParams } from "react-router-dom";

function ResetPassword() {
  const [userId, setUserId] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [backendErrors, setBackendErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const { token } = useParams();

  const getresetPasswordLoad = async () => {
    try {
      const response = await axios.get(`/reset-password?token=${token}`);

      setUserId(response.data.userId);
      console.log(response.data.userId);

      // Show success message
    } catch (error) {
      console.error(
        "Error fetching reset password load:",
        error.response.data.msg
      );
      setErrorMessage(error.response.data.msg);
    }
  };

  useEffect(() => {
    getresetPasswordLoad();
  }, [token]);

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setBackendErrors([]);
    setSuccessMessage(""); // Reset success message on new submission

    try {
      const response = await axios.post("/reset-password", {
        userId,
        token,
        verificationCode,
        password,
        confirmPassword,
      });
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
      {errorMessage ? (
        // Show error message\

        <div className="login-container">
          <div className="space-6"></div>

          <div className="position-relative">
            <div
              id="forgot-box"
              className="forgot-box visible widget-box no-border"
            >
              <div className="widget-body">
                <p
                  style={{ textAlign: "center", padding: "20px", color: "red" }}
                >
                  {errorMessage}
                </p>
                <div className="toolbar">
                  <a href="/" className="back-to-login-link">
                    Back to login
                    <i className="ace-icon fas bi-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Show the form
        <>
          <div className="p-3 rounded w-50 border loginForm">
            <h2 className="mt-3 mb-4">Reset Your Password</h2>

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
              <div className="mb-4">
                <label htmlFor="verification-code">
                  <strong>Verification Code</strong>
                </label>
                <input
                  type="text"
                  placeholder="Enter 10-digit Verification Code"
                  name="password-confirm"
                  className="form-control rounded-0"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={10}
                />
              </div>

              <div className="mb-4 position-relative">
                <label htmlFor="password">
                  <strong>Password</strong>
                </label>
                <input
                  type={visible ? "text" : "password"}
                  placeholder="Enter Password"
                  name="password"
                  className="form-control rounded-0"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <i className="eye-icon" onClick={() => setVisible(!visible)}>
                  {visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                </i>
              </div>

              <div className="mb-4 position-relative">
                <label htmlFor="password-confirm">
                  <strong>Confirm Password</strong>
                </label>
                <input
                  type={visible ? "text" : "password"}
                  placeholder="Enter Confirm Password"
                  name="password-confirm"
                  className="form-control rounded-0"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <i className="eye-icon" onClick={() => setVisible(!visible)}>
                  {visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                </i>
              </div>

              <button
                type="submit"
                className="btn btn-success w-100 rounded-0 mb-3"
              >
                Submit
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default ResetPassword;
