import React, { useState, useEffect } from "react";
import "./stylesheets/style.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [values, setValues] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const navigate = useNavigate();
  const [backendErrors, setBackendErrors] = useState([]);

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/get-user")
      .then((res) => {
        if (res.data.valid) {
          navigate(`/${res.data.path}`);
        } else {
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setBackendErrors([]); // Reset backend errors on new submission

    axios
      .post("http://localhost:3000/api/login", {
        ...values,
        rememberMe: values.rememberMe,
      })
      .then((response) => {
        // The server is expected to send a path on successful login
        if (response.data.Login) {
          navigate(`/${response.data.path}`);
        } else {
          // Handle any other response that is not an error but unexpected
          setBackendErrors([{ msg: "Unexpected response from the server." }]);
        }
      })
      .catch((error) => {
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
          console.error("Login error", error);
          setBackendErrors([
            { msg: "Network error or server not responding." },
          ]);
        }
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="p-3 rounded w-25 border loginForm">
        {backendErrors.length > 0 && (
          <div className="alert alert-danger" role="alert">
            {backendErrors.map((error, index) => (
              <div key={index}>{error.msg}</div>
            ))}
          </div>
        )}
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email Address</strong>
            </label>
            <input
              type="email"
              placeholder="Enter Email Address"
              id="email"
              name="email"
              value={values.email}
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
              id="password"
              name="password"
              value={values.password}
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              className="form-control rounded-0"
            />
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
              checked={values.rememberMe} // Bind the checked attribute
              onChange={(e) =>
                setValues({ ...values, rememberMe: e.target.checked })
              } // Update the state when changed
            />
            <label className="form-check-label" htmlFor="remember">
              Remember Me
            </label>
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
