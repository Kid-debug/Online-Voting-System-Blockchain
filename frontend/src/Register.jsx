import React, { useState } from "react";
import "./stylesheets/style.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import Web3 from "web3";
import votingContract from "../../build/contracts/VotingSystem.json";
import { contractAddress } from "../../config";
import cryptoRandomString from "crypto-random-string";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [backendErrors, setBackendErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  //removeItem kill session

  const handleRegister = async (event) => {
    event.preventDefault();

    const errors = validateSignUp();

    // If there are no errors, proceed with form submission
    if (Object.keys(errors).length === 0) {
      setBackendErrors([]);
      setSuccessMessage(""); // Reset success message on new submission
      try {
        const emailLower = email.toLowerCase();
        // Generate a verification token
        const randomToken = cryptoRandomString({ length: 16 });
        // Insert the valid user in to the blockchain
        const voterId = cryptoRandomString({ length: 16 });

        try {
          const web3 = new Web3(window.ethereum);
          await window.ethereum.enable();
          const accounts = await web3.eth.getAccounts();
          const contract = new web3.eth.Contract(
            votingContract.abi,
            contractAddress
          );
          await contract.methods
            .addVoter(voterId, emailLower, password, "U", randomToken)
            .send({ from: accounts[0] });

          setSuccessMessage(
            "Congratulations, you registered with us successfully! Please verify your email to proceed login!"
          );
          // send verification email
          await axios.post("http://localhost:3000/api/verifyEmail", {
            email,
            randomToken,
          });
          console.log("Form submitted successfully");
        } catch (error) {
          console.error("Error Msg : ", error.message);
        }
      
      } catch (err) {
        console.error(err);
      }
    } else {
      // Handle errors (e.g., display error messages)
      console.log("Form contains errors:", errors);
      setBackendErrors(Object.values(errors));
    }
  };

  const validateSignUp = () => {
    const errors = {};

    // Check if email is not empty
    if (!email.trim()) {
      errors.email = "•Email is required";
    } 

    // Check if password is not empty and meets requirements
    if (!password.trim()) {
      errors.password = "•Password is required";
    } else if (password.length < 8) {
      errors.password = "•Password must be at least 8 characters long";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password)
    ) {
      errors.password =
        "•Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character";
    }

    // Check if confirm password matches password
    if (!confirmPassword.trim()) {
      errors.confirmPassword = "•Confirm Password is required";
    } else if (confirmPassword !== password) {
      errors.confirmPassword = "•Confirm Password must match the password";
    }

    return errors;
  };

  return (
    <div className="loginPage">
      <div className="loginForm">
        <h2>Create User Account</h2>
        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

        {backendErrors.length > 0 && (
          <div className="alert alert-danger" role="alert">
            {backendErrors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        )}
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email Address</strong>
            </label>
            <input
              type="email"
              placeholder="Enter Email Address"
              name="email"
              className="form-control rounded-0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3 position-relative">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Enter Password"
              name="password"
              className="form-control rounded-0"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <i
              className="eye-icon"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </i>
          </div>

          <div className="mb-3 position-relative">
            <label htmlFor="confirmPassword">
              <strong>Confirm Password</strong>
            </label>
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              placeholder="Enter Confirm Password"
              name="confirmPassword"
              className="form-control rounded-0"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <i
              className="eye-icon"
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            >
              {confirmPasswordVisible ? (
                <EyeOutlined />
              ) : (
                <EyeInvisibleOutlined />
              )}
            </i>
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 rounded-0 mb-3"
          >
            Sign Up
          </button>
          <Link to="/" className="btn btn-light w-100 mb-2">
            Back to Login
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Register;
