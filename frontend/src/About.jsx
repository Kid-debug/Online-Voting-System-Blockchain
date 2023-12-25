import React, { useState } from "react";
import Header from "./container/Header";
import Footer from "./container/Footer";
import "./stylesheets/about.css";

function About() {
  const [showFullText, setShowFullText] = useState(false);

  const toggleFullText = () => {
    setShowFullText(!showFullText);
  };

  const text = `
  Welcome to our Online Voting System, your trusted platform for transparent and secure University Campus elections. Our commitment is to provide you with a convenient and secure way to participate in the democratic process, no matter where you are. Join us in shaping the future of our student government!

  We take pride in offering a user-friendly online voting experience that ensures your voice is heard. 

  Thank you for being an active participant in our democratic process. Together, we can create positive change and uphold the values of fairness, transparency, and inclusivity in our student government.

  Join us today and make your voice heard!
`;

  const maxLength = 500; // Adjust the length as needed

  const textToShow = showFullText ? text : text.slice(0, maxLength);

  return (
    <div>
      <Header />
      <div className="wrapper">
        <div className="background-container">
          <div className="bg-1"></div>
        </div>
        <div className="about-container">
          <div className="image-container">
            <img src="./aboutus.jpg" alt="" />
          </div>

          <div className="text-container">
            <h1>About us</h1>
            <p className="custom-paragraph">{textToShow}</p>
            {text.length > maxLength && (
              <a href="#" onClick={toggleFullText}>
                {showFullText ? "Read Less" : "Read More"}
              </a>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default About;
