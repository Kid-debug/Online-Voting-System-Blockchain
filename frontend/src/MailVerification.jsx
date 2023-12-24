import React, { useState, useEffect } from "react";
import "./stylesheets/mail.css";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "./api/axios";
import Web3 from "web3";
import votingContract from "../../build/contracts/VotingSystem.json";
import { contractAddress } from "../../config";

function MailVerification() {
  const { token } = useParams();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isVerify, setVerify] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);

  useEffect(() => {
    // When component mounts, check for token validity
    checkTokenValidity();
  }, [token]);

  const checkTokenValidity = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const contract = new web3.eth.Contract(
        votingContract.abi,
        contractAddress
      );
      const allVoters = await contract.methods.getAllVoter().call();

      const tokenExists = allVoters.some((voter) => voter.token === token);
      setIsTokenValid(tokenExists);

      if (!tokenExists) {
        setErrorMessage("The token is invalid or token has been used.");
      }
    } catch (error) {
      console.error("Error fetching all voters:", error);
      setErrorMessage("An error occurred while checking the token validity.");
    }
  };

  const verifyUser = async () => {
    if (!isTokenValid) {
      setErrorMessage("The token is invalid or has expired.");
      return;
    }
    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(
        votingContract.abi,
        contractAddress
      );

      await contract.methods
        .verifyVoterAccount(token)
        .send({ from: accounts[0] });

      setVerify(true);
      setSuccessMessage("Successfully Verify !");
    } catch (error) {
      console.error("Error Msg : ", error.message);
      console.error("Error fetching mail verification!");
    }
  };

  // Function to handle button click
  const handleButtonClick = () => {
    // Perform your verification logic here
    verifyUser();
    // Update the state to indicate that the button has been clicked
    setButtonClicked(true);
  };

  return (
    <div>
      {" "}
      <div className="wrapperContainer">
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
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "red",
                    }}
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
        ) : (
          // Show the form
          <>
            <div className="wrapperAlert">
              <div className="contentAlert">
                <div className="topHalf">
                  <div className="svg-container">
                    <svg viewBox="0 0 512 512" width="100" title="check-circle">
                      {isVerify ? (
                        <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z" />
                      ) : (
                        ""
                      )}{" "}
                    </svg>
                  </div>
                  <h1 className="text-center mail-h1">
                    {" "}
                    {isVerify
                      ? "Congratulations"
                      : "Please perform verify by metamask"}
                  </h1>
                  <ul class="bg-bubbles">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                  </ul>
                </div>
                <div className="bottomHalf">
                  <p>
                    {successMessage && (
                      <p className="text-success">{successMessage}</p>
                    )}
                    {/* {errorMessage && (
                  <p className="error-message text-danger">{errorMessage}</p>
                )} */}
                  </p>
                  <Link
                    to="/"
                    className="btn btn-success w-50"
                    hidden={!isVerify}
                  >
                    Go To Login
                  </Link>

                  <button
                    id="mailButton"
                    className={`btn ${
                      isVerify ? "btn-primary" : "btn-success"
                    } w-50`}
                    onClick={handleButtonClick}
                    // Disable the button after it's clicked
                    hidden={isVerify}
                  >
                    {isVerify ? "Verified" : "Verify"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MailVerification;
