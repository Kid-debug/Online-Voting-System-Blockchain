import React, { useState } from "react";
import Header from "./container/Header";
import Footer from "./container/Footer";
import "./result.css";
import ApexChart from "./admin/VoteTally"; // Import the ApexChart component

const candidateData = [
  {
    number: 1,
    name: "Chin Khai Ray",
    userId: "2205700",
    email: "ckr-wm20@student.tarc.edu.my",
    votes: 3,
    imageSrc: "img1.jpg",
    hasGoldMedal: true,
  },
  {
    number: 2,
    name: "Chin Zi Xin",
    userId: "2205701",
    email: "czx-wm20@student.tarc.edu.my",
    votes: 0,
    imageSrc: "img2.jpg",
    hasGoldMedal: false,
  },
  {
    number: 3,
    name: "Lim Er Hao",
    userId: "2205702",
    email: "leh-wm20@student.tarc.edu.my",
    votes: 1,
    imageSrc: "img3.jpg",
    hasGoldMedal: false,
  },
  {
    number: 4,
    name: "Tee Fo Yo",
    userId: "2205703",
    email: "tfy-wm20@student.tarc.edu.my",
    votes: 2,
    imageSrc: "img4.jpg",
    hasGoldMedal: false,
  },
  {
    number: 5,
    name: "Lee Sze Yen",
    userId: "2205704",
    email: "lsy-wm20@student.tarc.edu.my",
    votes: 0,
    imageSrc: "img5.jpg",
    hasGoldMedal: false,
  },
  {
    number: 6,
    name: "Tan Wei Jie",
    userId: "2205705",
    email: "twj-wm20@student.tarc.edu.my",
    votes: 0,
    imageSrc: "img6.jpg",
    hasGoldMedal: false,
  },
  {
    number: 7,
    name: "Wong Mei Ling",
    userId: "2205706",
    email: "wml-wm20@student.tarc.edu.my",
    votes: 0,
    imageSrc: "img7.jpg",
    hasGoldMedal: false,
  },
  {
    number: 8,
    name: "Lim Eng Chuan",
    userId: "2205707",
    email: "lec-wm20@student.tarc.edu.my",
    votes: 0,
    imageSrc: "img8.jpg",
    hasGoldMedal: false,
  },
  {
    number: 9,
    name: "Chong Mei Yen",
    userId: "2205708",
    email: "cmy-wm20@student.tarc.edu.my",
    votes: 0,
    imageSrc: "img9.jpg",
    hasGoldMedal: false,
  },
  {
    number: 10,
    name: "Ng Wei Lun",
    userId: "2205709",
    email: "nwl-wm20@student.tarc.edu.my",
    votes: 0,
    imageSrc: "img10.jpg",
    hasGoldMedal: false,
  },
];

const vicePresidentData = [
  {
    number: 1,
    name: "Vice President 1",
    userId: "2205800",
    email: "vp1-wm20@student.tarc.edu.my",
    votes: 4,
    imageSrc: "vp_img1.jpg",
    hasGoldMedal: true,
  },
  {
    number: 2,
    name: "Vice President 2",
    userId: "2205801",
    email: "vp2-wm20@student.tarc.edu.my",
    votes: 2,
    imageSrc: "vp_img2.jpg",
    hasGoldMedal: false,
  },
  {
    number: 3,
    name: "Vice President 3",
    userId: "2205802",
    email: "vp3-wm20@student.tarc.edu.my",
    votes: 3,
    imageSrc: "vp_img3.jpg",
    hasGoldMedal: false,
  },
  {
    number: 4,
    name: "Vice President 4",
    userId: "2205803",
    email: "vp4-wm20@student.tarc.edu.my",
    votes: 1,
    imageSrc: "vp_img4.jpg",
    hasGoldMedal: false,
  },
  {
    number: 5,
    name: "Vice President 5",
    userId: "2205804",
    email: "vp5-wm20@student.tarc.edu.my",
    votes: 0,
    imageSrc: "vp_img5.jpg",
    hasGoldMedal: false,
  },
  {
    number: 6,
    name: "Vice President 6",
    userId: "2205805",
    email: "vp6-wm20@student.tarc.edu.my",
    votes: 0,
    imageSrc: "vp_img6.jpg",
    hasGoldMedal: false,
  },
];

function Result() {
  const [displayExpandedContent, setDisplayExpandedContent] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("President");
  const [maxCandidatesToShow, setMaxCandidatesToShow] = useState(5);

  // Function to toggle the expansion
  const toggleExpansion = () => {
    setDisplayExpandedContent(!displayExpandedContent);
    if (!displayExpandedContent) {
      // Show all candidates when expanding
      setMaxCandidatesToShow(displayedCandidates.length);
    } else {
      // Show only 5 candidates when shortening
      setMaxCandidatesToShow(5);
    }
  };

  // Function to handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    // Reset the display when changing categories
    setDisplayExpandedContent(false);
    setMaxCandidatesToShow(5);
  };

  // Determine which candidate data to display based on the selected category
  const displayedCandidates =
    selectedCategory === "President" ? candidateData : vicePresidentData;

  // Filter the candidates based on the maximum to show
  const visibleCandidates = displayedCandidates.slice(0, maxCandidatesToShow);

  return (
    <div>
      <Header />
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
              <li>2023 FOCS Election</li>
            </div>
          </ul>
        </div>
      </div>

      <div className="container mt-5">
        <h1>2023 FOCS Election</h1>
        <div className="container mt-4">
          <div id="category-filter" className="category-filter">
            <button
              className={`category-button ${
                selectedCategory === "President" ? "selected" : ""
              }`}
              onClick={() => handleCategoryChange("President")}
            >
              President
            </button>
            <button
              className={`category-button ${
                selectedCategory === "Vice President" ? "selected" : ""
              }`}
              onClick={() => handleCategoryChange("Vice President")}
            >
              Vice President
            </button>
          </div>
          <div id="header">
            <h1>Vote History ({selectedCategory})</h1>
          </div>
          <div id="leaderboard">
            <div className="ribbon"></div>
            <table>
              <tbody>
                {visibleCandidates.map((candidate, index) => (
                  <tr key={index} className={index === 0 ? "text-white" : ""}>
                    <td className="number">{candidate.number}</td>
                    <td className="name">
                      <div className="name-container">
                        <div>{candidate.name}</div>
                      </div>
                    </td>
                    <td id="info" style={{ fontSize: "20px" }}>
                      <div className="user-id">{candidate.userId}</div>
                      <div className="email">{candidate.email}</div>
                    </td>
                    <td id="vote-info" style={{ fontSize: "20px" }}>
                      <div className="votes">
                        Number Of Votes: {candidate.votes}
                      </div>
                    </td>
                    {index === 0 ? (
                      <td className="image">
                        <img
                          src={candidate.imageSrc}
                          alt="Image"
                          className="image"
                        />
                      </td>
                    ) : (
                      <td>
                        <img
                          src={candidate.imageSrc}
                          alt="Image"
                          className="image"
                        />
                      </td>
                    )}
                    {candidate.hasGoldMedal && (
                      <td className="image">
                        <img
                          className="gold-medal"
                          src="gold-medal.png"
                          alt="gold medal"
                        />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {displayedCandidates.length > 5 && (
            <div id="buttons">
              <button className="continue" onClick={toggleExpansion}>
                {displayExpandedContent ? "Shorten" : "Expand"}
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Result;
