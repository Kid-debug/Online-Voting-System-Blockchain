import React, { useState, useEffect } from "react";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import "./stylesheets/style.css";
import { Link, useParams } from "react-router-dom";
import Web3 from "web3";
import votingContract from "../../build/contracts/VotingSystem.json";
import { contractAddress } from "../../config";

function ResetPassword() {
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [backendErrors, setBackendErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const { token } = useParams();

  useEffect(() => {
    checkResetPasswordToken();
  }, [token]);

  const checkResetPasswordToken = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const contract = new web3.eth.Contract(
        votingContract.abi,
        contractAddress
      );

      const response = await contract.methods
        .isResetPasswordTokenValid(token)
        .call();
      const isValid = response[0];
      console.log(isValid);
      const email = response[1];
      console.log(email);

      if (!isValid) {
        setErrorMessage(
          "The link has expired or invalid token. Please try again."
        );
      } else {
        const emailExists = await contract.methods
          .checkUserExistByEmail(email)
          .call();
        if (!emailExists) {
          setErrorMessage("This account is not found.");
        }
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
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();

    const errors = validateResetPassword();

    // If there are no errors, proceed with form submission
    if (Object.keys(errors).length === 0) {
      setBackendErrors([]);
      setErrorMessage("");
      setSuccessMessage(""); // Reset success message on new submission

      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        const contract = new web3.eth.Contract(
          votingContract.abi,
          contractAddress
        );

        const response = await contract.methods
          .isResetPasswordTokenValid(token)
          .call();
        const isValid = response[0];
        console.log(isValid);
        const email = response[1];
        console.log(email);

        // Check if reset password token is valid
        if (!isValid) {
          throw new Error(
            "The link has expired or the token is invalid. Please try again."
          );
        }

        // Check if the email from the token exists
        const emailExists = await contract.methods
          .checkUserExistByEmail(email)
          .call();
        if (!emailExists) {
          throw new Error("This account is not found.");
        }

        // Check if the verification code is valid
        const isCodeValid = await contract.methods
          .isVerificationCodeValid(verificationCode)
          .call();
        if (!isCodeValid) {
          throw new Error("The verification code is incorrect.");
        }

        // Update the password in the smart contract
        await contract.methods
          .updateUserPassword(email, password)
          .send({ from: accounts[0] });

        setSuccessMessage("You have successfully changed your password.");
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
        // Set the error messages array with the single error message
        setBackendErrors([errorMessage]);
      }
    } else {
      // Handle errors (e.g., display error messages)
      console.log("Form contains errors:", errors);
      setBackendErrors(Object.values(errors));
    }
  };

  const validateResetPassword = () => {
    const errors = {};

    // Check if verification code is not empty
    if (!verificationCode) {
      errors.verificationCode = "• Verification Code is required";
    } else if (!/^\d{6}$/.test(verificationCode)) {
      // Check if verification code is exactly 6 digits
      errors.verificationCode = "• Verification Code must be exactly 6 digits";
    }

    // Check if password is not empty and meets requirements
    if (!password.trim()) {
      errors.password = "• Password is required";
    } else if (password.length < 8) {
      errors.password = "• Password must be at least 8 characters long";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password)
    ) {
      errors.password =
        "• Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character";
    }

    // Check if confirm password matches password
    if (!confirmPassword.trim()) {
      errors.confirmPassword = "• Confirm Password is required";
    } else if (confirmPassword !== password) {
      errors.confirmPassword = "• Confirm Password must match the password";
    }

    return errors;
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      {errorMessage ? (
        // Show error message

        <div className="login-container">
          <div className="space-6"></div>

          <div className="position-relative">
            <div
              id="forgot-box"
              className="forgot-box visible widget-box no-border"
            >
              <div className="widget-body">
                <p
                  style={{ textAlign: "center", padding: "20px", color: "red" }}
                >
                  {errorMessage}
                </p>
                <div className="toolbar">
                  <a href="/" className="back-to-login-link">
                    Back to login
                    <i className="ace-icon fas bi-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : successMessage ? (
        // Show success message

        <div className="login-container">
          <div className="space-6"></div>

          <div className="position-relative">
            <div
              id="forgot-box"
              className="forgot-box visible widget-box no-border"
            >
              <div className="widget-body">
                <p
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "green",
                  }}
                >
                  {successMessage}
                </p>
                <div className="toolbar">
                  <a href="/" className="back-to-login-link">
                    Back to login
                    <i className="ace-icon fas bi-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Show the form
        <>
          <div className="p-3 rounded w-50 border loginForm">
            <h2 className="mt-3 mb-4">Reset Your Password</h2>
            {backendErrors.length > 0 && (
              <div className="alert alert-danger" role="alert">
                {backendErrors.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}
            <form onSubmit={handleResetPassword}>
              <div className="mb-4">
                <label htmlFor="verification-code">
                  <strong>Verification Code</strong>
                </label>
                <input
                  type="text"
                  placeholder="Enter 6-digit Verification Code"
                  name="password-confirm"
                  className="form-control rounded-0"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                />
              </div>

              <div className="mb-4 position-relative">
                <label htmlFor="password">
                  <strong>Password</strong>
                </label>
                <input
                  type={visible ? "text" : "password"}
                  placeholder="Enter Password"
                  name="password"
                  className="form-control rounded-0"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <i className="eye-icon" onClick={() => setVisible(!visible)}>
                  {visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                </i>
              </div>

              <div className="mb-4 position-relative">
                <label htmlFor="password-confirm">
                  <strong>Confirm Password</strong>
                </label>
                <input
                  type={visible ? "text" : "password"}
                  placeholder="Enter Confirm Password"
                  name="password-confirm"
                  className="form-control rounded-0"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <i className="eye-icon" onClick={() => setVisible(!visible)}>
                  {visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                </i>
              </div>

              <button
                type="submit"
                className="btn btn-success w-100 rounded-0 mb-3"
              >
                Submit
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default ResetPassword;
