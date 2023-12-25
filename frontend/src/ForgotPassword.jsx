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

    // List of hardcoded emails that cannot reset passwords
    const hardcodedEmails = ["superadmin@gmail.com", "voter@gmail.com"];

    if (!email.trim()) {
      setErrorMessage("Email is required");
      return;
    }

    try {
      const emailLower = email.toLowerCase();

      // Check if the email is in the list of hardcoded emails
      if (hardcodedEmails.includes(emailLower)) {
        setErrorMessage("Password reset is not allowed for this account.");
        return;
      }

      // Initialize web3 and the contract
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const contract = new web3.eth.Contract(
        votingContract.abi,
        contractAddress
      );

      // Find the voter by email and check their status
      const allVoters = await contract.methods.getAllVoter().call();
      const voter = allVoters.find((v) => v.email.toLowerCase() === emailLower);
      if (!voter) {
        setErrorMessage("Email does not exist.");
        return;
      }

      // Check if the account is verified
      if (Number(voter.status) !== 1) {
        setErrorMessage(
          "Your account is not in verified status, invalid to reset password"
        );
        return;
      }

      // Check if the voter already has a reset token
      if (voter.token) {
        setErrorMessage("Please check your email to reset your password.");
        return;
      }

      // Generate a verification token
      const randomToken = cryptoRandomString({ length: 16 });

      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        const contract = new web3.eth.Contract(
          votingContract.abi,
          contractAddress
        );

        //find the email and update the token
        await contract.methods
          .updateVoterTokenByEmail(emailLower, randomToken)
          .send({ from: accounts[0] });

        // setSuccessMessage("Email Sent Successfully for Reset Password");

        //send password reset email
        const response = await axios.post("/api/forget-password", {
          email,
          randomToken,
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
