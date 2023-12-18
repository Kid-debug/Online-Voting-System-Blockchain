import React, { useState, useEffect } from "react";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import "./stylesheets/style.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import Web3 from "web3";
import votingContract from "../../build/contracts/VotingSystem.json";
import { contractAddress } from "../../config";

// Set axios defaults just once, not in a function
axios.defaults.withCredentials = true;

function Login() {
  const { setAuthData } = useAuth();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const [backendErrors, setBackendErrors] = useState([]);
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBackendErrors([]); // Reset backend errors on new submission
    const errors = validateLogin();

    // If there are no errors, proceed with form submission
    if (Object.keys(errors).length === 0) {
      setBackendErrors([]);
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();

        const contract = new web3.eth.Contract(
          votingContract.abi,
          contractAddress
        );

        const accountFound = await contract.methods
          .checkVoterEmailPassword(values.email, values.password)
          .call();

        if (accountFound) {
          const userStatus = await contract.methods
            .getVoterStatus(values.email, values.password)
            .call();
          // user status; 0: no verify, 1: verified, 2:banned
          if (userStatus == 1) {
            // Login
            const user = await contract.methods
              .loginVoter(values.email, values.password)
              .call();
            sessionStorage.setItem("userKey", user.key);
            console.log("user : ", user);

            setAuthData({
              userKey: user.key,
              userId: Number(user.id),
              userRole: user.role,
              email: user.email,
            });
            console.log(user.role);
            // navigate to home
            if (user.role === "U") {
              navigate(`/voterdashboard`);
            } else {
              navigate(`/admin/home`);
            }
          } else if (userStatus == 0) {
            errors.wrongPassord = "• Account haven't verify.";
          } else {
            errors.wrongPassord = "• Account has been banned.";
          }
        } else {
          errors.wrongPassord = "• Email or password is incorrect.";
        }
        if (Object.keys(errors).length != 0) {
          setBackendErrors(Object.values(errors));
        }
      } catch (error) {
        setBackendErrors(Object.values(errors));
      }
    } else {
      setBackendErrors(Object.values(errors));
    }
  };

  //   const handleSubmit = async (event) => {

//     setAuthData({
//       userKey: "asdf123asdfasdcsdfweryfb",
//       userId: 1,
//       userRole: 'A',
//       email: "admin@email.com",
//     });

  //       navigate(`/voterdashboard`);

  // };

  const validateLogin = () => {
    const errors = {};

    // Check if email is not empty
    if (!values.email.trim()) {
      errors.email = "•Email is required";
    }

    // Check if password is not empty and meets requirements
    if (!values.password.trim()) {
      errors.password = "•Password is required";
    } else if (values.password.length < 8) {
      errors.password = "•Password must be at least 8 characters long";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(
        values.password
      )
    ) {
      errors.password =
        "•Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character";
    }

    return errors;
  };

  return (
    <div className="loginPage">
      <div className="loginForm">
        {backendErrors.length > 0 && (
          <div className="alert alert-danger" role="alert">
            {backendErrors.map((error, index) => (
              <div key={index}>{error}</div>
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
            />
          </div>
          <div className="mb-3 position-relative">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type={visible ? "text" : "password"}
              placeholder="Enter Password"
              id="password"
              name="password"
              value={values.password}
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              className="form-control rounded-0"
            />
            <i className="eye-icon" onClick={() => setVisible(!visible)}>
              {visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </i>
          </div>
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              name="remember"
              id="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
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
            Login
          </button>
          <Link to="/register" className="btn btn-light w-100 mb-2">
            Create User Account
          </Link>
          <div className="text-center">
            <Link to="/forgotPass" className="text-white text-decoration-none">
              Forgot Password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
