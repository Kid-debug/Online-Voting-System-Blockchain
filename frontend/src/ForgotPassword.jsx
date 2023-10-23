import React, { useState } from "react";
import "./stylesheets/style.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:8081/forgot-password", { email })
      .then((res) => {
        if (res.data.Status === "Success") {
          setSuccessMessage("Password reset email sent. Check your inbox.");
          // Navigate to the /resetPass route after a successful request
          navigate("/resetPass");
        } else {
          setError(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="p-3 rounded w-25 border loginForm">
        <div className="text-danger">{error && error}</div>
        <div className="text-success">{successMessage && successMessage}</div>
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email Address</strong>
            </label>
            <input
              type="email"
              placeholder="Enter Email Address"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control rounded-0"
              autoComplete="off"
            />
          </div>

          <Link
            to="/resetPass"
            className="btn btn-success w-100 rounded-0 mb-3"
          >
            Continue
          </Link>

          <Link to="/login" className="btn btn-light w-100 mb-2">
            Back to Login
          </Link>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
