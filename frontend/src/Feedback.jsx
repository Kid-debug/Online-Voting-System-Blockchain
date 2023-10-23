import React from "react";
import Header from "./container/Header";
import Footer from "./container/Footer";
import "./stylesheets/style.css";

function Feedback() {
  return (
    <div>
      <Header />
      <div class="container-feedback">
        <form>
          <h1>Give your Feedback</h1>
          <div class="id">
            <input type="text" placeholder="Full name" />
            <i className="fas bi bi-person feedback-icon"></i>
          </div>
          <div class="id">
            <input type="email" placeholder="Email address" />
            <i className="fas bi bi-envelope-fill feedback-icon"></i>
          </div>
          <textarea
            cols="15"
            rows="5"
            placeholder="Enter your feedback content here..."
          ></textarea>
          <button className="submit">Submit</button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default Feedback;
