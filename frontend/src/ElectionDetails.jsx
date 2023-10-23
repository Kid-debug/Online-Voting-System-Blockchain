import React from "react";
import Header from "./container/Header";
import Footer from "./container/Footer";
import "./stylesheets/electionlist.css";
import { Link } from "react-router-dom";

function ElectionDetails() {
  return (
    <div>
      <Header />
      <div class="wrapper-election">
        <div class="user-card">
          <div class="user-card-img"></div>
          <div class="user-card-info">
            <h2>2023 Student Council Election</h2>
            <p>
              <span>Category:</span> Computer Science Society
            </p>
            <p>
              <span>Start Date:</span> 2023-09-26
            </p>
            <p>
              <span>End Date:</span> 2023-10-03
            </p>
            <p>
              <span>Start Time:</span> 12:00 pm
            </p>
            <p>
              <span>End Time:</span> 11.59 am
            </p>
            <p>
              <span>Status </span> In Progress
            </p>
            <Link className="vote-btn" to="/voting">
              Vote
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ElectionDetails;
