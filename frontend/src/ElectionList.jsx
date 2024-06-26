import React from "react";
import Header from "./container/Header";
import Footer from "./container/Footer";
import { Link } from "react-router-dom";
import "./stylesheets/electionlist.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import votingContract from "../../build/contracts/VotingSystem.json";
import Web3 from "web3";
import { contractAddress } from "../../config";

function ElectionList() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentDateTime, setCurrentDatetTime] = useState();
  const [categoryName, setCategoryName] = useState("");
  const { categoryId } = useParams();

  useEffect(() => {
    function getCurrentDateTimeInMalaysia() {
      // Get the current date and time in UTC
      const now = new Date();
      // Convert it to Malaysia time (UTC+8)
      const malaysiaTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
      // Format the date and time to be suitable for the datetime-local input
      const formattedDateTime = malaysiaTime.toISOString().slice(0, 16);
      return formattedDateTime;
    }
    // Function to run every second
    const everySecondFunction = async () => {
      const currentTime = getCurrentDateTimeInMalaysia();
      const unixCurrentTime = new Date(currentTime).getTime() / 1000;
      setCurrentDatetTime(unixCurrentTime);
    };

    // Set up an interval to run every second
    const intervalId = setInterval(everySecondFunction, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to ensure it runs only once when the component mounts

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();

        const contract = new web3.eth.Contract(
          votingContract.abi,
          contractAddress
        );

        const category = await contract.methods
          .getCategoryById(categoryId)
          .call();

        setCategoryName(category.categoryName);

        // Call the getAllEvent function in smart contract
        const eventList = await contract.methods
          .getAllCategoryEvent(categoryId)
          .call();

        const availableEventList = eventList.filter(
          (event) => Number(event.status) !== 1
        );

        const eventPromises = availableEventList.map(async (event) => {
          const category = await contract.methods
            .getCategoryById(event.categoryId)
            .call();
          const candidates = await contract.methods
            .getAllCandidatesInEvent(event.categoryId, event.eventId)
            .call();

          let votetotal = 0;
          for (let i = 0; i < candidates.length; i++) {
            votetotal += Number(candidates[i].voteCount);
          }

          return {
            eventId: Number(event.eventId),
            eventName: event.eventName,
            categoryName: category.categoryName,
            candidatesCount: Number(event.candidateCount),
            eventStatus: Number(event.status),
            eventStartDate: Number(event.startDateTime),
            eventEndDate: Number(event.endDateTime),
            eventVoteTotal: votetotal,
          };
        });

        const formattedEvents = await Promise.all(eventPromises);
        console.log("Event", formattedEvents);
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching Event:", error);
      }
    };

    fetchCategories();
  }, []); // The empty dependency array ensures that this effect runs once, similar to componentDidMount

  const selectElection = (election) => {
    // Logic to select election and determine the next steps
    console.log("Selected Election:", election);
  };

  const getElectionStatus = (election) => {
    // 1: Upcoming, 2: In Progress, 3: Completed, 4： Cancel
    const status = election.eventStatus;
    console.log("status : ", status);
    if (status == 1) {
      return "No Candidates";
    } else if (status === 2) {
      return "Up Comming";
    } else if (status === 3) {
      return "Processing";
    } else if (status === 4) {
      return "Marking Winner";
    } else {
      return "Complete";
    }
  };

  const getElectionAction = (election) => {
    if (getElectionStatus(election) === "Processing" && !has_voted) {
      return <button onClick={() => vote(election)}>Vote</button>;
    } else {
      return "View Details";
    }
  };

  const vote = (election) => {
    // Placeholder logic for voting (can be integrated with actual backend logic later)
    has_voted = true;
    console.log("Voted for:", election["Election Name"]);
  };

  const filterData = (data) => {
    const searchTermLower = searchTerm.toLowerCase();
    return data.filter((event) =>
      Object.values(event).join(" ").toLowerCase().includes(searchTermLower)
    );
  };

  const sortedAndFilteredData = filterData(events); // Add sorting if necessary
  const totalPages = Math.ceil(sortedAndFilteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedAndFilteredData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  return (
    <div className="voterhome">
      <Header />
      <div className="election-container">
        <h2 className="mt-5 pt-3 mb-4">Election List : {categoryName}</h2>
        <div
          className="input-group mb-3"
          style={{ margin: "auto", width: "90%" }}
        >
          <div className="input-group-prepend">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
          </div>
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <table
          className="data-table election-table mt-4"
          style={{ margin: "auto", width: "90%" }}
        >
          <thead>
            <tr>
              <th>No.</th>
              <th>Position</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Total Voted</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center">
                  No matching records found
                </td>
              </tr>
            ) : (
              currentItems.map((election) => (
                <tr key={election.eventId}>
                  <td>{election.eventId}</td>
                  <td>{election.eventName}</td>
                  <td>{formatUnixTimestamp(election.eventStartDate)}</td>
                  <td>{formatUnixTimestamp(election.eventEndDate)}</td>
                  <td>{getElectionStatus(election)}</td>
                  <td>{election.eventVoteTotal}</td>
                  <td>
                    <Link
                      to={`/voting/${categoryId}/${election.eventId}`}
                      style={{
                        border: "none",
                        padding: "7px 20px",
                        borderRadius: "20px",
                        backgroundColor: "black",
                        color: "#e6e7e8",
                        textDecoration: "none", // Remove the default underline
                        display: "inline-block", // Make the link a block element
                      }}
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {events.length > 0 && (
          <div className="pagination-buttons">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="page-button"
            >
              &#8249;&#8249;
            </button>
            {[...Array(totalPages).keys()].map((page) => (
              <button
                key={page + 1}
                onClick={() => handlePageChange(page + 1)}
                style={{
                  fontWeight: currentPage === page + 1 ? "bold" : "normal",
                }}
                className={`page-button`}
              >
                {page + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="page-button"
            >
              &#8250;&#8250;
            </button>
            <label>
              Items per page:
              <select
                value={itemsPerPage}
                onChange={(e) =>
                  handleItemsPerPageChange(parseInt(e.target.value))
                }
                className="items-per-page-select"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
            </label>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ElectionList;
