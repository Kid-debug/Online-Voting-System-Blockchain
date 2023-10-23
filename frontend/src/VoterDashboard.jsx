import React, { useState, useEffect } from "react";
import Header from "./container/Header";
import Footer from "./container/Footer";
import { Link } from "react-router-dom";
import "./stylesheets/voterhome.css";

function VoterDashboard() {
  const cardData = [
    {
      title: "Chemistry and Biology",
    },
    {
      title: "Computer Science",
    },
    {
      title: "Food Science",
    },
    {
      title: "Sport and Exercise Science",
    },
    {
      title: "Dancing",
    },
  ];

  const inProgressData = [
    {
      title: "Badminton Club",
    },
    {
      title: "Basketball Club",
    },
    {
      title: "Chess Club",
    },
    {
      title: "Football Club",
    },
    {
      title: "Kendo Club",
    },
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const [inProgressPage, setInProgressPage] = useState(0);
  const cardsPerPage = 3;

  useEffect(() => {
    updateSliderButtons();
  }, [currentPage]);

  useEffect(() => {
    updateInProgressSliderButtons();
  }, [inProgressPage]);

  const handlePrevClick = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    const maxPage = Math.ceil(cardData.length / cardsPerPage) - 1;
    if (currentPage < maxPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleInProgressPrevClick = () => {
    if (inProgressPage > 0) {
      setInProgressPage(inProgressPage - 1);
    }
  };

  const handleInProgressNextClick = () => {
    const maxPage = Math.ceil(inProgressData.length / cardsPerPage) - 1;
    if (inProgressPage < maxPage) {
      setInProgressPage(inProgressPage + 1);
    }
  };

  const updateSliderButtons = () => {
    const prevButton = document.querySelector(".prev-button");
    const nextButton = document.querySelector(".next-button");
    const maxPage = Math.ceil(cardData.length / cardsPerPage) - 1;

    if (prevButton && nextButton) {
      prevButton.disabled = currentPage === 0;
      nextButton.disabled = currentPage === maxPage;
    }
  };

  const updateInProgressSliderButtons = () => {
    const prevButton = document.querySelector(".in-progress-prev-button");
    const nextButton = document.querySelector(".in-progress-next-button");
    const maxPage = Math.ceil(inProgressData.length / cardsPerPage) - 1;

    if (prevButton && nextButton) {
      prevButton.disabled = inProgressPage === 0;
      nextButton.disabled = inProgressPage === maxPage;
    }
  };

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, []);

  return (
    <div>
      <Header />
      <h2 className="mt-4">VOTER PORTAL</h2>

      <div className="container bg-primary mt-4 border border-dark-subtle">
        <div className="heading-container">
          <h2 className="text-white">Society</h2>
        </div>
        <div className="card-slider">
          <button className="prev-button" onClick={handlePrevClick}>
            <i className="fas bi-arrow-left"></i> {/* Left arrow icon */}
          </button>
          {cardData
            .slice(currentPage * cardsPerPage, (currentPage + 1) * cardsPerPage)
            .map((card, index) => (
              <div className="card" key={index}>
                <div className="body-container">
                  <div className="overlay"></div>
                  <div className="election-info">
                    <p className="title">{card.title}</p>
                    <div className="separator"></div>
                  </div>
                  <Link
                    to="/electionList"
                    className="action text-center text-decoration-none"
                  >
                    Proceed To Election
                  </Link>
                </div>
              </div>
            ))}
          <button className="next-button" onClick={handleNextClick}>
            <i className="fas bi bi-arrow-right"></i> {/* Right arrow icon */}
          </button>
        </div>
      </div>

      <div className="container bg-success mt-4 border border-dark-subtle mb-5">
        <div className="heading-container">
          <h2 className="text-white">Club</h2>
        </div>
        <div className="card-slider">
          <button className="prev-button" onClick={handleInProgressPrevClick}>
            <i className="fas bi-arrow-left"></i> {/* Left arrow icon */}
          </button>
          {inProgressData
            .slice(
              inProgressPage * cardsPerPage,
              (inProgressPage + 1) * cardsPerPage
            )
            .map((card, index) => (
              <div className="card" key={index}>
                <div className="body-container">
                  <div className="overlay"></div>
                  <div className="election-info">
                    <p className="title">{card.title}</p>
                    <div className="separator"></div>
                  </div>
                  <Link
                    to="/electionList"
                    className="action text-center text-decoration-none"
                  >
                    Proceed To Election
                  </Link>
                </div>
              </div>
            ))}
          <button className="next-button" onClick={handleInProgressNextClick}>
            <i className="fas bi bi-arrow-right"></i> {/* Right arrow icon */}
          </button>
        </div>
      </div>

      <div class="container container_instruction mb-4">
        <h3 id="round-corner">Voting Guidelines</h3>
        <p>
          Welcome to the online Voting Portal. This system is designed to
          provide a secure and transparent method for conducting elections. In
          this manual, we will explain how to use the system as a user.
          <h5>1. Accessing Your Account</h5>
          To begin the voting process, log in to your account using your
          registered user ID or email and your password. Ensure you have
          completed the registration process as described in the previous
          section.
          <h5>2. Selecting an Category</h5>
          From your dashboard, you will see a list of categories. Click on the
          category you wish to participate in to access the election list.
          <h5>3. Selecting an Election</h5>
          From your election list page, you will see a list of elections. Click
          on the election you wish to participate in to access more election
          details.
          <h5>3. Viewing the election details</h5>
          From your election details page, you will see a the details such as
          date and time. Click on the vote button if you want to continue the
          voting process.
          <h5>4. Reviewing Candidates</h5>
          Before casting your vote, take the time to review the candidates
          running in the election. You can typically find candidate profiles and
          their platforms to make an informed choice.
          <h5>5. Casting Your Vote</h5>
          When you are ready to vote, select your preferred candidate by
          clicking on their name or designated area. Review your choice
          carefully, as your vote cannot be changed once submitted.
          <h5>6. Confirming Your Vote</h5>
          After making your selection, you will be prompted to confirm your
          vote. Double-check that your chosen candidate is correct, and confirm
          your vote to complete the process.
          <h5>7. Verify Your Vote</h5>
          After confirming your vote, you will be prompted to enter your
          verification code that we sent to your email to verify you vote.
          <h5>8. Completed Your Vote</h5>
          When you enter the correct verification code, your vote will be
          counted and cannot make changes anymore. You can view the election
          result after your voting.
        </p>
      </div>

      <Footer />
    </div>
  );
}

export default VoterDashboard;
