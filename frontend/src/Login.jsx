<<<<<<< HEAD
import React, { useState, useContext, useEffect } from "react";
=======
import React, { useState } from "react";
>>>>>>> ba75df34aeaaefc52b8bbc4c45b1cdcd0f6e1fd9
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import "./stylesheets/style.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
<<<<<<< HEAD
import useAuth from "./hooks/useAuth";

// Set axios defaults just once, not in a function
axios.defaults.withCredentials = true;

function Login() {
  const { setAuthData } = useAuth();
=======

function Login() {
  const [visible, setVisible] = useState(false);
>>>>>>> ba75df34aeaaefc52b8bbc4c45b1cdcd0f6e1fd9
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
<<<<<<< HEAD
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  // const { updateAuth } = useContext(AuthContext);
  const [backendErrors, setBackendErrors] = useState([]);
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBackendErrors([]); // Reset backend errors on new submission

    const dataToSend = {
      email: values.email,
      password: values.password,
      remember: remember,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/login",
        dataToSend
      );

      // The server is expected to send a path and accessToken on successful login
      if (response.data.accessToken) {
        console.log("Login successful");
        console.log("Access Token: ", response.data.accessToken);
        console.log("Role: ", response.data.userRole);

        // Use setAuthData to update the auth state and persist it
        setAuthData({
          accessToken: response.data.accessToken,
          userRole: response.data.userRole,
          email: values.email,
        });
        navigate(`/${response.data.path}`);
      } else {
        setBackendErrors([{ msg: "Unexpected response from the server." }]);
      }
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
        // Handle errors not related to the backend response (network errors, etc.)
        console.error("Login error:", error);
        setBackendErrors([{ msg: "Network error or server not responding." }]);
      }
    }
=======
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
>>>>>>> ba75df34aeaaefc52b8bbc4c45b1cdcd0f6e1fd9
  };

  return (
    <div className="loginPage">
      <div className="loginForm">
<<<<<<< HEAD
        {backendErrors.length > 0 && (
          <div className="alert alert-danger" role="alert">
            {backendErrors.map((error, index) => (
              <div key={index}>{error.msg}</div>
            ))}
          </div>
        )}
=======
        <div className="text-danger">{error && error}</div>
>>>>>>> ba75df34aeaaefc52b8bbc4c45b1cdcd0f6e1fd9
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email Address</strong>
            </label>
            <input
              type="email"
              placeholder="Enter Email Address"
<<<<<<< HEAD
              id="email"
              name="email"
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              className="form-control rounded-0"
=======
              name="email"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              className="form-control rounded-0"
              autoComplete="off"
>>>>>>> ba75df34aeaaefc52b8bbc4c45b1cdcd0f6e1fd9
            />
          </div>
          <div className="mb-3 position-relative">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type={visible ? "text" : "password"}
              placeholder="Enter Password"
<<<<<<< HEAD
              id="password"
              name="password"
              value={values.password}
=======
              nme="password"
>>>>>>> ba75df34aeaaefc52b8bbc4c45b1cdcd0f6e1fd9
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              className="form-control rounded-0"
            />
            <i className="eye-icon" onClick={() => setVisible(!visible)}>
              {visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </i>
          </div>
<<<<<<< HEAD

=======
>>>>>>> ba75df34aeaaefc52b8bbc4c45b1cdcd0f6e1fd9
          <div className="float-end mb-2">
            <a href="/forgotPass" className="text-white text-decoration-none">
              Forgot Password?
            </a>
          </div>
<<<<<<< HEAD

=======
>>>>>>> ba75df34aeaaefc52b8bbc4c45b1cdcd0f6e1fd9
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="remember"
              id="remember"
<<<<<<< HEAD
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="remember">
              Remember Me
            </label>
=======
            />
            <label className="form-check-label">Remember Me</label>
>>>>>>> ba75df34aeaaefc52b8bbc4c45b1cdcd0f6e1fd9
          </div>
          <button
            type="submit"
            className="btn btn-success w-100 rounded-0 mb-3"
          >
            {" "}
<<<<<<< HEAD
            Login
=======
            Log in
>>>>>>> ba75df34aeaaefc52b8bbc4c45b1cdcd0f6e1fd9
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
