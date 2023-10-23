import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "./container/Header";
import Footer from "./container/Footer";
import "./style.css";

function Verification() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    // Navigate to the /voting route
    navigate("/voting");
  };

  const handleVoteSubmit = () => {
    // Show "Voted Successfully" alert
    alert("Voted Successfully");

    // Navigate to the /result route
    navigate("/result");
  };

  return (
    <div>
      <Header />
      <form className="mt-5 mb-5" id="msform">
        <fieldset>
          <h2 className="h2">Please verify your vote</h2>
          <h3 className="h3">We sent to your email</h3>
          <img
            src="./verification.jpg"
            alt="Verification"
            id="verification-image"
          />
          <h4 className="h4">Enter the verification code below</h4>
          <input
            type="text"
            name="twitter"
            placeholder="Enter verification code"
          />
          <input
            type="button"
            name="go back"
            className="previous"
            value="Go back"
            onClick={handleGoBack}
          />
          <input
            type="button"
            name="Submit"
            className="next action-button"
            value="Submit"
            onClick={handleVoteSubmit} // Add click handler for Submit button
          />
        </fieldset>
      </form>
      <Footer />
    </div>
  );
}

export default Verification;
