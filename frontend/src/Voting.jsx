import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./container/Header";
import Footer from "./container/Footer";
import "./stylesheets/voting.css";
import Web3 from "web3";
import { contractAddress } from "../../config";
import votingContract from "../../build/contracts/VotingSystem.json";
import { useParams } from "react-router-dom";
import Swal from "sweetalert";
import winnerIcon from "./images/winner-icon.png";

function Voting() {
  const [candidates, setCandidates] = useState([]);
  const { categoryId, eventId } = useParams();
  const [eventName, setEventName] = useState(null);
  const [eventStatus, setEventStatus] = useState(null);
  const [categoryName, setCategoryName] = useState(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  const [isVoted, setIsVoted] = useState();
  const [isClose, setIsClose] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const IMAGE_BASE_URL = "http://localhost:3000/uploads/";
  const authData = JSON.parse(sessionStorage.getItem("auth"));
  const userKey = authData ? authData.userKey : null;
  const [isCandidatesExist, setIsCandidatesExist] = useState(false);

  // State for President candidates
  const [expandedDescriptionPresident, setExpandedDescriptionPresident] =
    useState({});

  useEffect(() => {
    // Function to run every second
    const everySecondFunction = async () => {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();

      const contract = new web3.eth.Contract(
        votingContract.abi,
        contractAddress
      );

      const event = await contract.methods
        .getEventById(categoryId, eventId)
        .call();
      // 1- no candidates, 2- Upcomming, 3- Processing, 4- Marking Winner, 5 Completed

      // check if the current date and the start data and end date
      if (event.status == 3) {
        setIsClose(false);
      }
      if (event.status != 1 && event.status != 2 && event.status != 3) {
        setIsClose(true);
        setIsEnd(true);
      }
    };

    // Set up an interval to run every second
    setInterval(everySecondFunction, 1000);

    const fetchCategories = async () => {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();

        const contract = new web3.eth.Contract(
          votingContract.abi,
          contractAddress
        );

        const isVoted = await contract.methods
          .isVoted(categoryId, eventId, userKey)
          .call();

        setIsVoted(isVoted);

        // Call the getAllEvent function in smart contract
        const candidatesList = await contract.methods
          .getVoteEventCandidate(categoryId, eventId)
          .call();

        const category = await contract.methods
          .getCategoryById(categoryId)
          .call();
        const event = await contract.methods
          .getEventById(categoryId, eventId)
          .call();

        console.log("category : ", category);
        setCategoryName(category.categoryName);
        setEventName(event.eventName);
        setEventStatus(event.status);

        setCandidates(candidatesList);

        if (candidatesList != null) {
          setIsCandidatesExist(true);
        }
      } catch (error) {
        console.error("Error fetching Event:", error);
      }
    };

    fetchCategories();
  }, []); // The empty dependency array ensures that this effect runs once, similar to componentDidMount

  // instruction
  const instruction = "You are only allowed to choose 1 candidate";
  const noticeVoted = "You has been voted the candiates!";

  const candidatesPerPage = 5;

  // Functions for President candidates
  const handleReadMoreClickPresident = (candidateName) => {
    setExpandedDescriptionPresident((prevState) => ({
      ...prevState,
      [candidateName]: !prevState[candidateName],
    }));
  };

  // Handle radio button click for President and Vice President candidates
  const handleRadioClickPresident = (value) => {
    setSelectedCandidateId(value);
  };

  // State for showing the confirmation modal
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // Final Submit Button Click Handler
  const handleSubmit = async () => {
    // Handle the submission logic here
    if (!selectedCandidateId) {
      console.error("haven't select the candidate to vote.");
      return;
    }
    // Connect to the web3 provider (assuming MetaMask is installed)
    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(votingContract.abi, contractAddress);

    console.log("selectedCandidateId : ", Number(selectedCandidateId));

    // Perform the necessary action, e.g., sending a transaction
    const transaction = await contract.methods
      .vote(userKey, Number(selectedCandidateId), categoryId, eventId)
      .send({
        from: accounts[0], // Assuming the user's account is the first account
      });

    setIsVoted(true);

    Swal({
      icon: "success",
      title: "Successfully Voted!",
      text: "You've successfully voted a candidate.",
    });
  };

  const handleShowConfirmationModal = () => {
    setShowConfirmationModal(true);
  };

  const navigate = useNavigate();

  return (
    <div className="voterhome">
      <Header />

      <div className="container mt-5 pt-5 votesss">
        {/* President */}
        <div className="grey-container">
          <h2 style={{ textAlign: "center" }}>
            {categoryName} - {eventName}
          </h2>
        </div>
        <h4>{eventStatus == 5 ? "" : isVoted ? noticeVoted : instruction}</h4>
        <div className="radio-group row justify-content-between px-3 text-center a mt-4">
          {candidates.length === 0 ? (
            <h4>No matching records found</h4>
          ) : (
            candidates.map((candidate, index) => (
              <label
                key={index}
                className={`col-auto mx-3 card-block py-2 text-center radio ${
                  selectedCandidateId === candidate.id ? "selected" : ""
                }`}
                style={{
                  backgroundColor: candidate.win ? "rgb(159, 252, 193)" : "initial",
                }}
              >
                <input
                  type="radio"
                  name="candidatePresident"
                  value={Number(candidate.id)}
                  checked={selectedCandidateId === candidate.id}
                  disabled={eventStatus !== 3}
                  onChange={() => handleRadioClickPresident(candidate.id)}
                  style={{ display: "none" }}
                />
                <div className="flex-row">
                  <div className="col">
                    {isEnd && (
                      <p style={{ fontSize: "19px" }}>
                        Vote Count:{" "}
                        <strong>{Number(candidate.voteCount)}</strong>
                      </p>
                    )}
                    {candidate.win && (
                      <div
                        className="winner-indicator"
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          padding: "5px",
                        }}
                      >
                        <img
                          className={`irc_mut img-fluid circular-image`}
                          src={winnerIcon}
                          alt={candidate.name}
                          style={{ maxWidth: "100%", height: "auto" }}
                        />
                      </div>
                    )}
                    <div className="pic p-3 m-3">
                      <img
                        className={`irc_mut img-fluid circular-image`}
                        src={`${IMAGE_BASE_URL}${candidate.imageFileName}`}
                        alt={candidate.name}
                      />
                    </div>
                    <h4>
                      <strong>{candidate.name}</strong>
                    </h4>
                    <h5>{Number(candidate.studentId)}</h5>
                    <p className="description" style={{ fontSize: "17px" }}>
                      {expandedDescriptionPresident[candidate.name] ||
                      candidate.description.length <= 50
                        ? candidate.description
                        : candidate.description.slice(0, 50) + "..."}
                      {candidate.description.length > 30 && (
                        <a
                          href="#"
                          onClick={() =>
                            handleReadMoreClickPresident(candidate.name)
                          }
                        >
                          {expandedDescriptionPresident[candidate.name]
                            ? " Read Less"
                            : " Read More"}
                        </a>
                      )}
                    </p>
                    {selectedCandidateId === candidate.id && (
                      <div className="radio-button">
                        <i className="fa fa-check" />
                      </div>
                    )}
                  </div>
                </div>
              </label>
            ))
          )}
        </div>
      </div>

      {/* Final Submit Button */}
      <div className="form-actions">
        <button
          type="submit"
          style={{ width: "270px" }}
          className="vote-submit submit-btn"
          onClick={handleShowConfirmationModal}
          hidden={isVoted || isClose}
        >
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
                  handleSubmit(), setShowConfirmationModal(false);
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
