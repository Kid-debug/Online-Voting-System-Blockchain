import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./container/Header";
import Footer from "./container/Footer";
import "./stylesheets/voting.css";

const presidentCandidates = [
  {
    name: "Chin Khai Ray",
    image: "public/img1.jpg",
    userID: "2205700",
    description:
      "Chin Khai Ray is a dedicated student with a strong commitment to improving student life on campus. As a candidate for the President of the Student Council, he aims to bring positive changes and enhance student engagement.",
  },
  {
    name: "Chin Zi Xin",
    image: "public/img2.jpg",
    userID: "2205701",
    description:
      "Chin Khai Ray is a dedicated student with a strong commitment to improving student life on campus. As a candidate for the President of the Student Council, he aims to bring positive changes and enhance student engagement.",
  },
  {
    name: "Lim Er Hao",
    image: "public/img3.jpg",
    userID: "2205702",
    description:
      "Chin Khai Ray is a dedicated student with a strong commitment to improving student life on campus. As a candidate for the President of the Student Council, he aims to bring positive changes and enhance student engagement.",
  },
  {
    name: "Tee Fo Yo",
    image: "public/img4.jpg",
    userID: "2205703",
    description:
      "Chin Khai Ray is a dedicated student with a strong commitment to improving student life on campus. As a candidate for the President of the Student Council, he aims to bring positive changes and enhance student engagement.",
  },
  {
    name: "Lee Sze Yen",
    image: "public/img5.jpg",
    userID: "2205704",
    description:
      "Chin Khai Ray is a dedicated student with a strong commitment to improving student life on campus. As a candidate for the President of the Student Council, he aims to bring positive changes and enhance student engagement.",
  },
  {
    name: "Tan Wei Jie",
    image: "public/img6.jpg",
    userID: "2205705",
    description:
      "Chin Khai Ray is a dedicated student with a strong commitment to improving student life on campus. As a candidate for the President of the Student Council, he aims to bring positive changes and enhance student engagement.",
  },
  {
    name: "Wong Mei Ling",
    image: "public/img7.jpg",
    userID: "2205706",
    description:
      "Chin Khai Ray is a dedicated student with a strong commitment to improving student life on campus. As a candidate for the President of the Student Council, he aims to bring positive changes and enhance student engagement.",
  },
  {
    name: "Lim Eng Chuan",
    image: "public/img8.jpg",
    userID: "2205707",
    description:
      "Chin Khai Ray is a dedicated student with a strong commitment to improving student life on campus. As a candidate for the President of the Student Council, he aims to bring positive changes and enhance student engagement.",
  },
  {
    name: "Chong Mei Yen",
    image: "public/img9.jpg",
    userID: "2205708",
    description:
      "Chin Khai Ray is a dedicated student with a strong commitment to improving student life on campus. As a candidate for the President of the Student Council, he aims to bring positive changes and enhance student engagement.",
  },
  {
    name: "Ng Wei Lun",
    image: "public/img10.jpg",
    userID: "2205709",
    description:
      "Chin Khai Ray is a dedicated student with a strong commitment to improving student life on campus. As a candidate for the President of the Student Council, he aims to bring positive changes and enhance student engagement.",
  },
];

const vicePresidentCandidates = [
  {
    name: "Vice President Candidate 1",
    image: "public/vp_img1.jpg",
    userID: "2205710",
    description:
      "Vice President Candidate 1 is a dedicated student with a strong commitment to improving student life on campus. As a candidate for Vice President of the Student Council, they aim to bring positive changes and enhance student engagement.",
  },
  {
    name: "Vice President Candidate 2",
    image: "public/vp_img2.jpg",
    userID: "2205711",
    description:
      "Vice President Candidate 2 is a passionate student leader who is dedicated to making a difference on campus. They have a vision for a better student experience and want to serve as Vice President to bring positive changes.",
  },
  {
    name: "Vice President Candidate 3",
    image: "public/vp_img3.jpg",
    userID: "2205712",
    description:
      "Vice President Candidate 3 is a highly motivated student who believes in the power of student leadership. They aspire to be Vice President to advocate for student needs and enhance the overall campus experience.",
  },
  {
    name: "Vice President Candidate 4",
    image: "public/vp_img4.jpg",
    userID: "2205713",
    description:
      "Vice President Candidate 3 is a highly motivated student who believes in the power of student leadership. They aspire to be Vice President to advocate for student needs and enhance the overall campus experience.",
  },
  {
    name: "Vice President Candidate 5",
    image: "public/vp_img5.jpg",
    userID: "2205714",
    description:
      "Vice President Candidate 3 is a highly motivated student who believes in the power of student leadership. They aspire to be Vice President to advocate for student needs and enhance the overall campus experience.",
  },
  {
    name: "Vice President Candidate 6",
    image: "public/vp_img6.jpg",
    userID: "2205715",
    description:
      "Vice President Candidate 3 is a highly motivated student who believes in the power of student leadership. They aspire to be Vice President to advocate for student needs and enhance the overall campus experience.",
  },
];

function Voting() {
  // instruction
  const instruction = "You are only allowed to choose 1 candidate";

  const [searchQuery, setSearchQuery] = useState("");

  // State for President candidates
  const [expandedDescriptionPresident, setExpandedDescriptionPresident] =
    useState({});
  const [selectedCandidatePresident, setSelectedCandidatePresident] =
    useState("");
  const [currentPagePresident, setCurrentPagePresident] = useState(0);

  // State for Vice President candidates
  const [
    expandedDescriptionVicePresident,
    setExpandedDescriptionVicePresident,
  ] = useState({});
  const [selectedCandidateVicePresident, setSelectedCandidateVicePresident] =
    useState("");
  const [currentPageVicePresident, setCurrentPageVicePresident] = useState(0);

  const candidatesPerPage = 5;

  // Functions for President candidates
  const handleReadMoreClickPresident = (candidateName) => {
    setExpandedDescriptionPresident((prevState) => ({
      ...prevState,
      [candidateName]: !prevState[candidateName],
    }));
  };

  const handleNextClickPresident = () => {
    setCurrentPagePresident((prevPage) => prevPage + 1);
  };

  const handlePrevClickPresident = () => {
    setCurrentPagePresident((prevPage) => prevPage - 1);
  };

  // Functions for Vice President candidates
  const handleReadMoreClickVicePresident = (candidateName) => {
    setExpandedDescriptionVicePresident((prevState) => ({
      ...prevState,
      [candidateName]: !prevState[candidateName],
    }));
  };

  const handleNextClickVicePresident = () => {
    setCurrentPageVicePresident((prevPage) => prevPage + 1);
  };

  const handlePrevClickVicePresident = () => {
    setCurrentPageVicePresident((prevPage) => prevPage - 1);
  };

  // Get visible candidates for President and Vice President
  const startIndexPresident = currentPagePresident * candidatesPerPage;
  const endIndexPresident = startIndexPresident + candidatesPerPage;
  const visibleCandidatesPresident = presidentCandidates.slice(
    startIndexPresident,
    endIndexPresident
  );

  const startIndexVicePresident = currentPageVicePresident * candidatesPerPage;
  const endIndexVicePresident = startIndexVicePresident + candidatesPerPage;
  const visibleCandidatesVicePresident = vicePresidentCandidates.slice(
    startIndexVicePresident,
    endIndexVicePresident
  );

  // Check if it's the first or last page for President and Vice President candidates
  const isFirstPagePresident = currentPagePresident === 0;
  const isLastPagePresident = endIndexPresident >= presidentCandidates.length;

  const isFirstPageVicePresident = currentPageVicePresident === 0;
  const isLastPageVicePresident =
    endIndexVicePresident >= vicePresidentCandidates.length;

  // Handle radio button click for President and Vice President candidates
  const handleRadioClickPresident = (value) => {
    setSelectedCandidatePresident(value);
  };

  const handleRadioClickVicePresident = (value) => {
    setSelectedCandidateVicePresident(value);
  };

  // State for showing the confirmation modal
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // Final Submit Button Click Handler
  const handleSubmit = () => {
    // Handle the submission logic here

    // Show the confirmation modal
    setShowConfirmationModal(true);
  };

  const navigate = useNavigate();

  return (
    <div>
      <Header />
      <div className="voting-container">
        {/* Search Bar */}
        <div className="search-container w-50">
          <input
            type="text"
            placeholder="Search By Candidate Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-icon">&#128269;</span>{" "}
          {/* This is a Unicode search icon */}
        </div>
      </div>
      <div className="filter-container">
        <div className="category-head">
          <ul>
            <div className="category-title active" id="all">
              <li>All</li>
              <span>
                <i className="fas bi-border-all"></i>
              </span>
            </div>
            <div className="category-title" id="president">
              <li>President</li>
            </div>
            <div className="category-title" id="vice president">
              <li>Vice President</li>
            </div>
            <div className="category-title" id="secretary">
              <li>Secretary</li>
            </div>
            <div className="category-title" id="treasurer">
              <li>Treasurer</li>
            </div>
            <div className="category-title" id="committee">
              <li>Committee Member</li>
            </div>
          </ul>
        </div>
      </div>

      <div className="container">
        {/* President */}
        <div className="grey-container">
          <h5>President</h5>
        </div>
        <h4>{instruction}</h4>
        <div className="radio-group row justify-content-between px-3 text-center a mt-4">
          {visibleCandidatesPresident.map((candidate, index) => (
            <label
              key={index}
              className={`col-auto mx-3 card-block py-2 text-center radio ${
                selectedCandidatePresident === candidate.name ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name="candidatePresident"
                value={candidate.name}
                checked={selectedCandidatePresident === candidate.name}
                onChange={() => handleRadioClickPresident(candidate.name)}
                style={{ display: "none" }}
              />
              <div className="flex-row">
                <div className="col">
                  <div className="pic p-3 m-3">
                    <img
                      className={`irc_mut img-fluid circular-image`}
                      src={candidate.image}
                      alt={`Candidate ${index + startIndexPresident + 1}`}
                    />
                  </div>
                  <p>{candidate.name}</p>
                  <p>{candidate.userID}</p>
                  <p className="description">
                    {expandedDescriptionPresident[candidate.name] ||
                    candidate.description.length <= 30
                      ? candidate.description
                      : candidate.description.slice(0, 30) + "..."}
                  </p>
                  {candidate.description.length > 30 && (
                    <a
                      href="#"
                      onClick={() =>
                        handleReadMoreClickPresident(candidate.name)
                      }
                    >
                      {expandedDescriptionPresident[candidate.name]
                        ? "Read Less"
                        : "Read More"}
                    </a>
                  )}
                  {selectedCandidatePresident === candidate.name && (
                    <div className="radio-button">
                      <i className="fa fa-check" />
                    </div>
                  )}
                </div>
              </div>
            </label>
          ))}
        </div>
        <div className="text-center">
          <button
            className="btn btn-primary"
            onClick={handlePrevClickPresident}
            disabled={isFirstPagePresident}
          >
            <i className="fas bi bi-chevron-left"></i>
          </button>
          <button
            className="btn btn-primary"
            onClick={handleNextClickPresident}
            disabled={isLastPagePresident}
          >
            <i className="fas bi bi-chevron-right"></i>
          </button>
        </div>
      </div>

      {/* Vice President */}
      <div className="container">
        <div className="grey-container">
          <h5>Vice President</h5>
        </div>
        <h4>{instruction}</h4>
        <div className="radio-group row justify-content-between px-3 text-center a mt-4">
          {visibleCandidatesVicePresident.map((candidate, index) => (
            <label
              key={index}
              className={`col-auto mx-3 card-block py-2 text-center radio ${
                selectedCandidateVicePresident === candidate.name
                  ? "selected"
                  : ""
              }`}
            >
              <input
                type="radio"
                name="candidateVicePresident"
                value={candidate.name}
                checked={selectedCandidateVicePresident === candidate.name}
                onChange={() => handleRadioClickVicePresident(candidate.name)}
                style={{ display: "none" }}
              />
              <div className="flex-row">
                <div className="col">
                  <div className="pic p-3 m-3">
                    <img
                      className={`irc_mut img-fluid circular-image`}
                      src={candidate.image}
                      alt={`Candidate ${index + startIndexVicePresident + 1}`}
                    />
                  </div>
                  <p>{candidate.name}</p>
                  <p>{candidate.userID}</p>
                  <p className="description">
                    {expandedDescriptionVicePresident[candidate.name] ||
                    candidate.description.length <= 30
                      ? candidate.description
                      : candidate.description.slice(0, 30) + "..."}
                  </p>
                  {candidate.description.length > 30 && (
                    <a
                      href="#"
                      onClick={() =>
                        handleReadMoreClickVicePresident(candidate.name)
                      }
                    >
                      {expandedDescriptionVicePresident[candidate.name]
                        ? "Read Less"
                        : "Read More"}
                    </a>
                  )}
                  {selectedCandidateVicePresident === candidate.name && (
                    <div className="radio-button">
                      <i className="fa fa-check" />
                    </div>
                  )}
                </div>
              </div>
            </label>
          ))}
        </div>
        <div className="text-center">
          <button
            className="btn btn-primary"
            onClick={handlePrevClickVicePresident}
            disabled={isFirstPageVicePresident}
          >
            <i className="fas bi bi-chevron-left"></i>
          </button>
          <button
            className="btn btn-primary"
            onClick={handleNextClickVicePresident}
            disabled={isLastPageVicePresident}
          >
            <i className="fas bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
      {/* Final Submit Button */}
      <div className="text-center mt-4 mb-3">
        <button className="vote-submit" onClick={handleSubmit}>
          Submit
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="confirm">
          <div className="confirm__window">
            <div className="confirm__titlebar">
              <span className="confirm__title">
                Vote Submission Confirmation
              </span>
              <button
                className="confirm__close"
                onClick={() => setShowConfirmationModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="confirm__content">
              Are you sure you want to submit your vote?
            </div>
            <div className="confirm__buttons">
              <button
                className="confirm__button confirm__button--ok confirm__button--fill"
                onClick={() => {
                  // Replace the following with your actual vote submission logic
                  alert(
                    "Your vote is pending, need to go to email verification to verify your vote!!!"
                  );
                  navigate("/verification");
                  setShowConfirmationModal(false);
                }}
              >
                OK
              </button>
              <button
                className="confirm__button confirm__button--cancel"
                onClick={() => setShowConfirmationModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Voting;
