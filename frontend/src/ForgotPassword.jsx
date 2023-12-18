import React, { useEffect, useState } from "react";
import axios from "./api/axios";
import { useNavigate } from "react-router-dom";
import "./stylesheets/style.css";
import Web3 from "web3";
import votingContract from "../../build/contracts/VotingSystem.json";
import { contractAddress } from "../../config";
import cryptoRandomString from "crypto-random-string";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email.trim()) {
      setErrorMessage("Email is required");
      return;
    }

    try {
      const emailLower = email.toLowerCase();

      // Initialize web3 and the contract
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const contract = new web3.eth.Contract(
        votingContract.abi,
        contractAddress
      );

      // Check if the email exists in the smart contract
      const emailExists = await contract.methods
        .checkUserExistByEmail(emailLower)
        .call();
      if (!emailExists) {
        setErrorMessage("Email does not exist.");
        return;
      }

      // Check if a recent reset password request exists
      const recentRequestExists = await contract.methods
        .isRecentResetRequest(emailLower)
        .call();
      if (recentRequestExists) {
        setErrorMessage(
          `You have previously requested to reset your password. Please check your email: ${emailLower}`
        );
        return;
      }

      // Generate a verification token
      const randomToken = cryptoRandomString({ length: 16 });
      //Generate a 6-digit verification code
      const code = generateVerificationCode();

      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        const contract = new web3.eth.Contract(
          votingContract.abi,
          contractAddress
        );
        await contract.methods
          .addResetPasswordRequest(emailLower, randomToken, code)
          .send({ from: accounts[0] });

        // setSuccessMessage("Email Sent Successfully for Reset Password");

        //send password reset email
        const response = await axios.post("/api/forget-password", {
          email,
          randomToken,
          code,
        });

        // Check if the response indicates a successful email send
        if (response.data && response.data.success) {
          // Navigate to the PasswordResetConfirmation page with success message
          navigate("/resetPass", {
            state: { successMessage: response.data.message },
          });
        } else {
          // Handle the case where the email sending wasn't successful
          setErrorMessage(
            response.data.message || "Failed to send reset password email."
          );
        }
      } catch (error) {
        let errorMessage = "An error occurred while adding the reset password.";
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
      let errorMessage = "An error occurred while checking the email account.";
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
  };

  function generateVerificationCode() {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  return (
    <div className="loginPage">
      <div className="loginForm">
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

        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              <strong>Email Address</strong>
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter Email Address"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-success w-100 rounded-0 mb-3"
          >
            Send Reset Password Link
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="btn btn-light w-100 mb-2"
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
