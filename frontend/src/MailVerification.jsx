import React, { useState, useEffect } from "react";
import "./stylesheets/mail.css";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "./api/axios";

function MailVerification() {
  const { token } = useParams();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const getMailVerification = async () => {
    try {
      const response = await axios.get(`/mail-verification?token=${token}`);
      console.log(response.data.message);

      setSuccessMessage(response.data.message);

      // Show success message
    } catch (error) {
      console.error(
        "Error fetching mail verification:",
        error.response.data.message
      );
      setErrorMessage(error.response.data.message);
    }
  };

  useEffect(() => {
    getMailVerification();
  }, [token]);

  return (
    <div>
      {" "}
      <div className="wrapperContainer">
        <div className="wrapperAlert">
          <div className="contentAlert">
            <div className="topHalf">
              <div className="svg-container">
                <svg viewBox="0 0 512 512" width="100" title="check-circle">
                  <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z" />
                </svg>
              </div>
              <h1 className="text-center mail-h1">Congratulations</h1>
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
                {errorMessage && (
                  <p className="error-message text-danger">{errorMessage}</p>
                )}
              </p>
              <Link to="/" className="btn btn-success w-50">
                Go To Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MailVerification;
