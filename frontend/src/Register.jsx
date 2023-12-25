import React, { useState } from "react";
import "./stylesheets/style.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import Web3 from "web3";
import votingContract from "../../build/contracts/VotingSystem.json";
import { contractAddress } from "../../config";
import cryptoRandomString from "crypto-random-string";
import Swal from "sweetalert";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [backendErrors, setBackendErrors] = useState([]);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  //removeItem kill session

  const handleRegister = async (event) => {
    event.preventDefault();

    const emailErrors = await validateEmail();

    // Check if there are email errors
    if (Object.keys(emailErrors).length > 0) {
      setBackendErrors([]);
      setErrorMessage("");
      setSuccessMessage(""); // Reset success message on new submission
      setBackendErrors(Object.values(emailErrors));
      return; // Stop further processing if there are email errors
    }

    // Continue with password validation
    const passwordErrors = validatePassword();
    const errors = { ...passwordErrors };

    if (email.length > 40) {
      Swal(
        "Error!",
        "Email cannot more than 40 characters.",
        "error"
      );
      return;
    }

    if (password.length > 40) {
      Swal(
        "Error!",
        "Password cannot more than 40 characters.",
        "error"
      );
      return;
    }

    // If there are no errors, proceed with form submission
    if (Object.keys(errors).length === 0) {
      setBackendErrors([]);
      setErrorMessage("");
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

          setSuccessMessage(
            "You've successfully registered with us. Please check your email to proceed the verification!"
          );
        } catch (error) {
          let errorMessage =
            "An error occurred while creating the admin account.";
          // Check if the error message includes a revert
          if (error.message && error.message.includes("revert")) {
            const matches = error.message.match(/revert (.+)/);
            errorMessage =
              matches && matches[1]
                ? matches[1]
                : "Transaction reverted without a reason.";
          } else if (error.message) {
            errorMessage = error.message;
          }

          setErrorMessage(errorMessage);
        }
      } catch (error) {
        let errorMessage =
          "An error occurred while creating the admin account.";
        // Check if the error message includes a revert
        if (error.message && error.message.includes("revert")) {
          const matches = error.message.match(/revert (.+)/);
          errorMessage =
            matches && matches[1]
              ? matches[1]
              : "Transaction reverted without a reason.";
        } else if (error.message) {
          errorMessage = error.message;
        }

        setErrorMessage(errorMessage);
      }
    } else {
      // Handle errors (e.g., display error messages)
      console.log("Form contains errors:", errors);
      setBackendErrors(Object.values(errors));
    }
  };

  const validateEmail = async () => {
    const errors = {};

    // Check if email is not empty and must be tarumt student account
    if (!email.trim()) {
      errors.email = "• Email is required";
    } else if (!email.trim().toLowerCase().endsWith("@student.tarc.edu.my")) {
      errors.email = "• Email must be a @student.tarc.edu.my";
    }

    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(votingContract.abi, contractAddress);

    //use getAllVoter to check the email is exist or not
    // Fetch all voters
    const voters = await contract.methods.getAllVoter().call();

    // Check if email already exists
    const emailLower = email.toLowerCase();

    const existingVoter = voters.find(
      (voter) => voter.email.toLowerCase() === emailLower
    );

    if (existingVoter) {
      // Check the status of the existing account
      if (Number(existingVoter.status) === 0) {
        // Resend validation token
        const randomToken = cryptoRandomString({ length: 16 });
        try {
          // Update the validation token in the blockchain
          await contract.methods
            .updateVoterTokenByEmail(existingVoter.email, randomToken)
            .send({ from: accounts[0] });

          setSuccessMessage(
            "Verification token resent! Please check your email to proceed."
          );
          // Resend verification email
          await axios.post("http://localhost:3000/api/verifyEmail", {
            email,
            randomToken,
          });
        } catch (error) {
          // Handle error during token resend
          errors.email = "Error resending verification token.";
        }
      } else if (Number(existingVoter.status) === 1) {
        // Account exists and is already verified
        errors.email = "Email already exists and cannot be duplicated!";
      } else if (Number(existingVoter.status) === 2) {
        // Account is banned
        errors.email = "Your account has been banned, not allowed to register!";
      }
    }

    return errors;
  };

  const validatePassword = () => {
    const errors = {};

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

        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
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
