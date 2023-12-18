import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../hooks/useAuth";

function Header() {
  const [isNavExpanded, setIsNavExpanded] = useState(false); // State to manage navbar collapse
  const [isFeedbackMenuOpen, setIsFeedbackMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (event) => {
    event.preventDefault(); // Prevent the default anchor behavior
    // try {
    //   await axios.get("http://localhost:3000/api/logout", {
    //     withCredentials: true,
    //   });
    logout();
    navigate("/");
    setIsNavExpanded(false); // Collapse the navbar on logout
    // } catch (error) {
    //   console.error("Logout failed", error);
    // }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-3">
      <div className="container-fluid">
        <Link to="/voterdashboard" className="navbar-brand text-white">
          Online Voting System
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarNavDropdown"
          aria-expanded={isNavExpanded ? "true" : "false"}
          aria-label="Toggle navigation"
          onClick={() => setIsNavExpanded(!isNavExpanded)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className={`navbar-collapse collapse ${isNavExpanded ? "show" : ""}`}
          id="navbarNavDropdown"
        >
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link
                to="/voterdashboard"
                className="nav-link mx-2"
                onClick={() => setIsNavExpanded(false)}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/about"
                className="nav-link mx-2"
                onClick={() => setIsNavExpanded(false)}
              >
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/profile"
                className="nav-link mx-2"
                onClick={() => setIsNavExpanded(false)}
              >
                Profile
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/votehistorylist"
                className="nav-link mx-2"
                onClick={() => setIsNavExpanded(false)}
              >
                Vote History
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a
                href="/"
                className="nav-link mx-2 dropdown-toggle"
                id="feedbackDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded={isFeedbackMenuOpen ? "true" : "false"}
                onClick={(e) => {
                  e.preventDefault();
                  setIsFeedbackMenuOpen(!isFeedbackMenuOpen);
                }}
              >
                Feedback
              </a>
              <ul
                className={`dropdown-menu ${isFeedbackMenuOpen ? "show" : ""}`}
                aria-labelledby="feedbackDropdown"
              >
                <li>
                  <Link
                    to="/userfeedbacklist"
                    className="dropdown-item"
                    onClick={() => {
                      setIsNavExpanded(false);
                      setIsFeedbackMenuOpen(false);
                    }}
                  >
                    View Feedback
                  </Link>
                </li>
                <li>
                  <Link
                    to="/feedback"
                    className="dropdown-item"
                    onClick={() => {
                      setIsNavExpanded(false);
                      setIsFeedbackMenuOpen(false);
                    }}
                  >
                    Submit Feedback
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <a href="/" className="nav-link mx-2" onClick={handleLogout}>
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
