import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./container/Header";
import Footer from "./container/Footer";
import "./stylesheets/result.css";
import Web3 from "web3";
import { contractAddress } from "../../config";
import votingContract from "../../build/contracts/VotingSystem.json";

function Result() {
  const { categoryId, eventId } = useParams();
  const [candidates, setCandidates] = useState([]);
  const [eventName, setEventName] = useState(null);
  const [categoryName, setCategoryName] = useState(null);
  const [displayExpandedContent, setDisplayExpandedContent] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("President");
  const [maxCandidatesToShow, setMaxCandidatesToShow] = useState(5);
  const IMAGE_BASE_URL = "http://localhost:3000/uploads/";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();

        const contract = new web3.eth.Contract(
          votingContract.abi,
          contractAddress
        );

        const candidatesList = await contract.methods
          .getVoteEventCandidate(categoryId, eventId)
          .call();

        const category = await contract.methods
          .getCategoryById(categoryId)
          .call();
        const event = await contract.methods
          .getEventById(categoryId, eventId)
          .call();

        setCategoryName(category.categoryName);
        setEventName(event.eventName);
        setCandidates(candidatesList);
        console.log(sortedCandidates);

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

  const visibleCandidates = candidates.slice(0, maxCandidatesToShow);

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <div className="text-center">
          <h1>Vote History</h1>
        </div>
        <hr />
        <div className="container">
          <h1 className="mb-3">
            <strong>{eventName}</strong>({categoryName})
          </h1>
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
                      <td className="name">
                        <div className="name-container">
                          <div>{candidate.name}</div>
                        </div>
                      </td>
                      <td id="info" style={{ fontSize: "20px" }}>
                        <div className="student-id">
                          {Number(candidate.studentId)}
                        </div>
                      </td>
                      <td id="vote-info" style={{ fontSize: "20px" }}>
                        <div className="votes">
                          Number Of Votes: {candidate.voteCount}
                        </div>
                      </td>
                      {index === 0 ? (
                        <td className="image">
                          <img
                            src={`${IMAGE_BASE_URL}${candidate.imageFileName}`}
                            alt="Image"
                            className="image"
                          />
                        </td>
                      ) : (
                        <td>
                          <img
                            src={`${IMAGE_BASE_URL}${candidate.imageFileName}`}
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

export default Result;
