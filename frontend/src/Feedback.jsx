import React, { useState } from "react";
import Header from "./container/Header";
import Footer from "./container/Footer";
import "./stylesheets/feedback.css"; // Ensure this path is correct

function Feedback() {
  const [selectedEmotion, setSelectedEmotion] = useState(null);

  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
  };
  return (
    <div className="feedback-wrapper">
      <Header />
      <div className="container-feedback">
        <form>
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
            <input type="text" placeholder="Full name" />
            <i className="las la-user feedback-icon"></i>
          </div>
          <div className="input-group">
            <input type="email" placeholder="Email address" />
            <i className="las la-envelope feedback-icon"></i>
          </div>
          <textarea
            className="feedback-textarea"
            cols="15"
            rows="5"
            placeholder="Enter your feedback content here..."
          ></textarea>
          <div className="form-actions">
            <button className="submit-btn">Submit</button>
            <button className="cancel-btn" type="button">
              Cancel
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default Feedback;
