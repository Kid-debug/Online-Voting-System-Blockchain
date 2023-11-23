import React, { useState } from "react";
import Header from "./container/Header";
import Footer from "./container/Footer";
import "./stylesheets/feedback.css";
import useAuth from "./hooks/useAuth";
import Swal from "sweetalert";

function Feedback() {
  const { auth } = useAuth();
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false); // New state for showing the confirmation prompt

  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
  };

  // New function to handle the form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true); // Show the confirmation prompt
  };

  // New function to handle the actual submission logic
  const submitFeedback = () => {
    setShowConfirmation(false); // Hide the confirmation prompt
    // Here you can add the logic to actually submit the feedback, for example:
    // axios.post('/api/feedback', { /* your feedback data */ })
    //   .then(response => console.log(response))
    //   .catch(error => console.error(error));

    Swal({
      title: "Feedback submitted!",
      text: "Thank you for your feedback!",
      icon: "success",
    });

    // Swal({
    //   icon: "error",
    //   title: "Oops...",
    //   text: "Something went wrong!",
    // });
  };

  // New function to handle the cancellation of the submission
  const cancelSubmit = () => {
    setShowConfirmation(false); // Hide the confirmation prompt
  };

  return (
    <div className="feedback-wrapper">
      <Header />
      <div className="container-feedback">
        <form onSubmit={handleFormSubmit}>
          <h1 className="feedback-title">Give your Feedback</h1>
          <div className="feedback-level">
            {["sad-tear", "frown", "meh", "smile", "grin"].map((emotion) => (
              <button
                key={emotion}
                className={`level ${
                  selectedEmotion === emotion ? "active" : ""
                }`}
                onClick={() => handleEmotionSelect(emotion)}
                type="button"
              >
                <i className={`lar la-${emotion}`}></i>
              </button>
            ))}
          </div>
          <div className="input-group">
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              value={auth.email}
              disabled="true"
            />
            <i className="las la-envelope feedback-icon"></i>
          </div>
          <div className="input-group">
            <input id="name" name="name" type="text" placeholder="Full name" />
            <i className="las la-user feedback-icon"></i>
          </div>
          <textarea
            className="feedback-textarea"
            cols="15"
            rows="5"
            placeholder="Enter your feedback content here..."
          ></textarea>
          <div className="form-actions">
            <button className="submit-btn">Submit</button>
          </div>
        </form>
        {showConfirmation && (
          <div className="confirm">
            <div className="confirm__window">
              <div className="confirm__titlebar">
                <span className="confirm__title">
                  Feedback Submit Confirmation
                </span>
                <button className="confirm__close" onClick={cancelSubmit}>
                  &times;
                </button>
              </div>
              <div className="confirm__content">
                Are you sure to submit your feedback?
              </div>
              <div className="confirm__buttons">
                <button
                  className="confirm__button confirm__button--ok confirm__button--fill"
                  onClick={submitFeedback}
                >
                  OK
                </button>
                <button
                  className="confirm__button confirm__button--cancel"
                  onClick={cancelSubmit}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Feedback;
