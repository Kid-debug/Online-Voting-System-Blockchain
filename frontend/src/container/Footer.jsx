import React, { useEffect, useState } from "react";
import "../stylesheets/footer.css";

function Footer() {
  // State to track whether the scroll-to-top button should be displayed
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Function to scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Event listener to check if the user has scrolled down enough to show the button
  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 100) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      <div className="main-content">
        <div className="left box">
          <h2>About us</h2>
          <div className="content">
            <p>
              Welcome to our Online Voting System, your trusted platform for
              transparent and secure University Campus elections. We're
              committed to making the democratic process accessible and secure,
              allowing you to cast your vote conveniently from any device. Join
              us in shaping the future of our student government!
            </p>
            <div className="social">
              <a href="https://facebook.com/coding.np">
                <span className="fab fa-facebook-f"></span>
              </a>
              <a href="#">
                <span className="fab fa-twitter"></span>
              </a>
              <a href="https://instagram.com/coding.np">
                <span className="fab fa-instagram"></span>
              </a>
              <a href="https://youtube.com/c/codingnepal">
                <span className="fab fa-youtube"></span>
              </a>
            </div>
          </div>
        </div>
        <div className="center box">
          <h2>Address</h2>
          <div className="content">
            <div className="phone">
              <span className="fas fa"></span>
              <span className="text">+012 345678</span>
              <span className="text">xxx@student.tarc.edu.my</span>
            </div>
            <div className="email">
              <span className="fas fa"></span>
              <span className="text">+024455 456</span>
              <span className="text">xxx@student.tarc.edu.my</span>
            </div>
          </div>
        </div>
        <div className="right box">
          <h2>Contact us</h2>
          <div className="content">
            <form action="#">
              <div className="email">
                <div className="text text-white">Email *</div>
                <input className="text-white" type="email" required />
              </div>
              <div className="msg">
                <div className="text text-white">Message *</div>
                <textarea
                  className="text-white"
                  rows="2"
                  cols="25"
                  required
                ></textarea>
              </div>
              <div className="btn">
                <button type="submit">Send</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {showScrollButton && (
        <div className="scroll-to-top" onClick={scrollToTop}>
          <i className="fas bi-chevron-up"></i>
        </div>
      )}
      <div className="bottom">
        <center>
          <span className="credit">
            Created By <a href="#">XXX</a> |{" "}
          </span>
          <span className="far fa-copyright"></span>
          <span> 2023 All rights reserved.</span>
        </center>
      </div>
    </div>
  );
}

export default Footer;
