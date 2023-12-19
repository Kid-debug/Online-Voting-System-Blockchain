import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./container/Header";
import Footer from "./container/Footer";
import "./stylesheets/result.css";
import Web3 from "web3";
import { contractAddress } from "../../config";
import votingContract from "../../build/contracts/VotingSystem.json";

function VoteHistory() {
  const { categoryId, eventId } = useParams();
  const [candidates, setCandidates] = useState([]);
  const [eventName, setEventName] = useState(null);
  const [categoryName, setCategoryName] = useState(null);
  const [displayExpandedContent, setDisplayExpandedContent] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("President");
  const [maxCandidatesToShow, setMaxCandidatesToShow] = useState(5);
  const IMAGE_BASE_URL = "http://localhost:3000/uploads/";
  const authData = JSON.parse(sessionStorage.getItem("auth"));
  const userKey = authData ? authData.userKey : null;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();

        const contract = new web3.eth.Contract(
          votingContract.abi,
          contractAddress
        );

        const votedHistories = await contract.methods
        .getAllVotedHistory(userKey)
        .call();

        const votedHistoriesPromises = votedHistories.map(async (votedHistory) => {
          const category = await contract.methods
            .getCategoryById(votedHistory.categoryId)
            .call();
            const candidates = await contract.methods
            .getAllCandidatesInEvent(votedHistory.categoryId, votedHistory.eventId)
            .call();

            const event = await contract.methods
            .getEventById(votedHistory.categoryId,votedHistory.eventId)
            .call();
          
          let candidateFound;
          for (const candidate of candidates) {
            if (candidate.id == votedHistory.votedCandidateId) {
              candidateFound = candidate;
              // console.log("candidateFound ",candidateFound);
              break; // If you found the candidate, you can exit the loop
            }
          }
          return {
            candidateName: candidateFound.name,
            candidateImg : candidateFound.imageFileName,
            candidateStudId: candidateFound.studentId,
            categoryName: category.categoryName,
            eventName: event.eventName,
            eventStatus: Number(event.status),
            eventStartDate: Number(event.startDateTime),
            eventEndDate: Number(event.endDateTime),
          };
        });

        const formattedCandidates = await Promise.all(votedHistoriesPromises);
        
        setCandidates(formattedCandidates);

        //based on vote count to assign the index number, who vote count the highest be the first one then assigned sequentially
        //if the candidate vote count is the same, then depend on the time who get the higher vote count firstthen give the rank
        // the highest one will get the gold medal
      } catch (error) {
        console.error("Error fetching Event:", error);
      }
    };

    fetchCategories();
  }, [categoryId, eventId]);

  const toggleExpansion = () => {
    setDisplayExpandedContent(!displayExpandedContent);
    if (!displayExpandedContent) {
      setMaxCandidatesToShow(candidates.length);
    } else {
      setMaxCandidatesToShow(5);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setDisplayExpandedContent(false);
    setMaxCandidatesToShow(5);
  };

  const formatUnixTimestamp = (timestamp) => {
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: "Asia/Kuala_Lumpur", // Set the desired time zone
    }).format(timestamp * 1000); // Convert timestamp to milliseconds

    return formattedDate;
  };

  const visibleCandidates = candidates.slice(0, maxCandidatesToShow);
console.log("visibleCanm ", visibleCandidates);
  return (
    <div>
      <Header />
      <div className="container mt-5">
        <div className="text-center">
          <h1>Vote History</h1>
        </div>
        <hr />
        <div className="container">
          {candidates.length === 0 ? (
            <p className="no-candidate-message">No candidate records found</p>
          ) : (
            <div id="leaderboard">
              <div className="ribbon"></div>
              <table>
                <tbody>
                  {visibleCandidates.map((candidate, index) => (
                    <tr key={index} className={index === 0 ? "text-white" : ""}>
                      <td className="number">{index + 1}</td>
                      {index === 0 ? (
                        <td className="image">
                          <img
                            src={`${IMAGE_BASE_URL}${candidate.candidateImg}`}
                            alt="Image"
                            className="image"
                          />
                        </td>
                      ) : (
                        <td>
                          <img
                            src={`${IMAGE_BASE_URL}${candidate.candidateImg}`}
                            alt="Image"
                            className="image"
                          />
                        </td>
                      )}
                      <td className="name">
                        <div className="name-container">
                          <div>{candidate.candidateName}</div>
                        </div>
                      </td>
                      <td id="info" style={{ fontSize: "20px" }}>
                        <div className="student-id">
                          {candidate.categoryName}
                        </div>
                      </td>
                      <td id="vote-info" style={{ fontSize: "20px" }}>
                        <div className="votes">
                          {candidate.eventName}
                        </div>
                      </td>
                      <td id="vote-info" style={{ fontSize: "20px" }}>
                        <div className="votes">
                          Event End : {formatUnixTimestamp(candidate.eventEndDate)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {candidates.length > 5 && (
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

export default VoteHistory;
