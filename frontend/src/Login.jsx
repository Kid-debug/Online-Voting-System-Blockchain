import React, { useState } from "react";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import "./stylesheets/style.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [visible, setVisible] = useState(false);
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className="loginPage">
      <div className="loginForm">
        <div className="text-danger">{error && error}</div>
        <h2>Login</h2>
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
          <div className="mb-3 position-relative">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type={visible ? "text" : "password"}
              placeholder="Enter Password"
              nme="password"
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              className="form-control rounded-0"
            />
            <i className="eye-icon" onClick={() => setVisible(!visible)}>
              {visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </i>
          </div>
          <div className="float-end mb-2">
            <a href="/forgotPass" className="text-white text-decoration-none">
              Forgot Password?
            </a>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="remember"
              id="remember"
            />
            <label className="form-check-label">Remember Me</label>
          </div>
          <button
            type="submit"
            className="btn btn-success w-100 rounded-0 mb-3"
          >
            {" "}
            Log in
          </button>
          <Link to="/register" className="btn btn-light w-100 mb-2">
            Create User Account
          </Link>
          <Link to="/adminregister" className="btn btn-secondary w-100 mb-2">
            Create Admin Account
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
