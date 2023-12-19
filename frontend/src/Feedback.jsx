import React, { useState } from "react";
import Header from "./container/Header";
import Footer from "./container/Footer";
import "./stylesheets/feedback.css";
import Swal from "sweetalert";
import useAuth from "./hooks/useAuth";
import axios from "axios";

function Feedback() {
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false); // New state for showing the confirmation prompt

  const [feedbackText, setFeedbackText] = useState(""); // State to store the feedback text
  const characterLimit = 300; // Character limit for the textarea

  // Retrieve the auth context
  const { auth } = useAuth();
  const userId = auth.userId;
  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
  };

  // Function to handle text changes in the textarea
  const handleTextChange = (e) => {
    if (e.target.value.length <= characterLimit) {
      setFeedbackText(e.target.value);
    }
  };
  // Add a function to get the appropriate class for character count
  const getCharacterCountClass = () => {
    return feedbackText.length === characterLimit
      ? "character-count limit-reached"
      : "character-count";
  };
  const handleReset = () => {
    setSelectedEmotion(null); // Reset selected emotion to null
    setFeedbackText(""); // Reset feedback text to empty string
  };

  // New function to handle the form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true); // Show the confirmation prompt
  };

  // New function to handle the actual submission logic
  const submitFeedback = async (e) => {
    setShowConfirmation(false);

    try {
      // Convert selected emotion to numerical value
      const emotionValues = {
        "sad-tear": 1,
        frown: 2,
        meh: 3,
        smile: 4,
        grin: 5,
      };

      const selectedEmotionValue = emotionValues[selectedEmotion];

      const dataToSend = {
        selectedEmotion: selectedEmotionValue,
        feedbackText: feedbackText,
      };

      const response = await axios.post(
        "http://localhost:3000/api/submitFeedback",
        {
          ...dataToSend,
          userId,
        }
      );

      Swal({
        title: "Submit Feedback Successfully!",
        text: response.data.msg,
        icon: "success",
        button: {
          text: "OK",
        },
      });
      handleReset();
    } catch (error) {
      if (error.response) {
        // If the backend sends an array of errors
        if (error.response.data.errors) {
          Swal({
            icon: "error",
            title: "Failed to Submit Feedback!",
            text: error.response.data.errors.map((e) => e.msg).join("\n"),
            button: {
              text: "OK",
            },
          });
        } else {
          // If the backend sends a single error message
          Swal({
            icon: "error",
            title: "Failed to Submit Feedback!",
            text: error.response.data.msg,
            button: {
              text: "OK",
            },
          });
        }
      } else {
        // Handle other errors here
        console.error("Submitting Feedback error:", error);
        Swal({
          icon: "error",
          title: "Internal Server Error",
          text: "Network error occurred.",
          button: {
            text: "OK",
          },
        });
      }
    }
  };

  // New function to handle the cancellation of the submission
  const cancelSubmit = () => {
    setShowConfirmation(false); // Hide the confirmation prompt
  };

  const getConfirmationContent = () => {
    return {
      title: "Feedback Submit Confirmation",
      content: "Are you sure you want to submit your feedback?",
    };
  };

  return (
    <div className="voterhome">
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
          <textarea
            id="feedbackText"
            name="feedbackText"
            className="feedback-textarea"
            cols="15"
            rows="5"
            placeholder="Enter your feedback content here..."
            value={feedbackText}
            onChange={handleTextChange}
            maxLength={300}
          />
          {/* Move the character count display out of the textarea tag */}
          <div className={getCharacterCountClass()}>
            {feedbackText.length} / {characterLimit}
          </div>
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
                {getConfirmationContent().content}
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
