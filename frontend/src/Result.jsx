import React, { useState, useEffect } from "react";
import Header from "./container/Header";
import Footer from "./container/Footer";
import "./stylesheets/result.css";
import votingContract from "../../build/contracts/VotingSystem.json";
import Web3 from "web3";
import { contractAddress } from "../../config";
function Result() {
  const [displayExpandedContent, setDisplayExpandedContent] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("President");
  const [maxCandidatesToShow, setMaxCandidatesToShow] = useState(5);
  const authData = JSON.parse(sessionStorage.getItem("auth"));
  const userKey = authData ? authData.userKey : null;
  const [voteHistories, setVoteHistories] = useState([]);

  useEffect(() => {
    const fetchVotedHistory = async () => {
      try {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        await window.ethereum.enable();

        const contract = new web3.eth.Contract(
          votingContract.abi,
          contractAddress
        );

        // Call the getAllEvent function in smart contract
        const votedHistory = await contract.methods
          .getAllVotedHistory(userKey)
          .call();
            let count = 0;
        const votedPromises = votedHistory.map(async (voteHistory) => {
          const category = await contract.methods
            .getCategoryById(voteHistory.categoryId)
            .call();

          const event = await contract.methods
            .getEventById(voteHistory.categoryId, voteHistory.eventId)
            .call();

          const candidates = event.candidates;
          let candidateName = "";

          const votedCandidate = candidates.find(
            (candidate) => candidate.id === voteHistory.votedCandidateId
          );

          if (votedCandidate) {
            candidateName = votedCandidate.name;
          }
          count +=1;
          return {
            number : count,
            eventId: Number(event.eventId),
            eventName: event.eventName,
            categoryId: Number(category.categoryId),
            categoryName: category.categoryName,
            candidateName: candidateName,
          };
        });

        const formattedVotedHistory = await Promise.all(votedPromises);
        setVoteHistories(formattedVotedHistory);
        console.log("candidateName : ", formattedVotedHistory);
      } catch (error) {
        console.error("Error fetching Event:", error);
      }
    };

    fetchVotedHistory();
  }, []); // The empty dependency array ensures that this effect runs once, similar to componentDidMount

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


  // Determine which candidate data to display based on the selected category
  const displayedCandidates = voteHistories;

  // Filter the candidates based on the maximum to show
  const visibleCandidates = displayedCandidates.slice(0, maxCandidatesToShow);

  return (
    <div>
      <Header />

      <div className="container mt-5">
        <h1>2023 FOCS Election</h1>
        <div className="container mt-4">
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
                        <div>{candidate.candidateName}</div>
                      </div>
                    </td>
                    <td id="info" style={{ fontSize: "20px" }}>
                      <div className="user-id">{candidate.categoryName}</div>
                    </td>
                    <td id="vote-info" style={{ fontSize: "20px" }}>
                      <div className="votes">{candidate.eventName}</div>
                    </td>
                    
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
