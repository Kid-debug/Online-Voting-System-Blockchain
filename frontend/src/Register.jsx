import React, { useState } from "react";
import "./style.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:8081/login", values)
      .then((res) => {
        if (res.data.Status === "Success") {
          navigate("/");
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
        <h2>Create New Account</h2>
        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email Address</strong>
            </label>
            <input
              type="email"
              placeholder="Enter Email Address"
              name="email"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              className="form-control rounded-0"
              autoComplete="off"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              className="form-control rounded-0"
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
              onChange={(e) =>
                setValues({ ...values, passwordConfirm: e.target.value })
              }
              className="form-control rounded-0"
            />
            <span id="message"></span>
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 rounded-0 mb-3"
          >
            {" "}
            Sign Up
          </button>
          <Link to="/login" className="btn btn-light w-100 mb-2">
            Back to Login
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Register;
