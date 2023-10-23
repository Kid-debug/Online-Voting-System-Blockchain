import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Header() {
  const navigate = useNavigate();
  const handleLogout = () => {
    axios
      .get("http://localhost:8081/logout")
      .then((res) => {
        navigate("/login");
      })
      .catch((err) => console.log(err));
  };

  return (
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark p-3">
      <div class="container-fluid">
        <Link to="/VoterDashboard" class="navbar-brand text-white">
          Online Voting System
        </Link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class=" collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav ms-auto ">
            <li class="nav-item">
              <Link to="/voterdashboard" class="nav-link mx-2">
                Home
              </Link>
            </li>
            <li class="nav-item">
              <Link to="/about" class="nav-link mx-2">
                About
              </Link>
            </li>
            <li class="nav-item">
              <Link to="/profile" class="nav-link mx-2">
                Profile
              </Link>
            </li>
            <li class="nav-item">
              <Link to="/result" class="nav-link mx-2">
                Vote History
              </Link>
            </li>
            <li class="nav-item">
              <Link to="/feedback" class="nav-link mx-2">
                Feedback
              </Link>
            </li>
            <li class="nav-item" onClick={handleLogout}>
              <a class="nav-link mx-2" href="#">
                <i className="fs bi-power"></i> Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
