import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Header from "./container/Header";
import Footer from "./container/Footer";
import votingContract from "../../build/contracts/VotingSystem.json";
import Web3 from "web3";
import { contractAddress } from "../../config";
import "./stylesheets/votehistory.css";
import Swal from "sweetalert";

function ElectionResult() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("0"); // "0" represents "All"
  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState();
  const [filteredVoteData, setFilteredVoteData] = useState([]);
  const IMAGE_BASE_URL = "http://localhost:3000/uploads/";

  useEffect(() => {
    function getCurrentDateTimeInMalaysia() {
      const now = new Date();
      const malaysiaTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
      const formattedDateTime = malaysiaTime.toISOString().slice(0, 16);
      return formattedDateTime;
    }

    const everySecondFunction = async () => {
      const currentTime = getCurrentDateTimeInMalaysia();
      const unixCurrentTime = new Date(currentTime).getTime() / 1000;
      setCurrentDateTime(unixCurrentTime);
    };

    const intervalId = setInterval(everySecondFunction, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchCategoriesAndEvents = async () => {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();

        const contract = new web3.eth.Contract(
          votingContract.abi,
          contractAddress
        );

        const categoryList = await contract.methods.getAllCategory().call();
        const formattedCategories = categoryList
          .filter((category) => Number(category.categoryId) !== 0)
          .map((category) => ({
            categoryId: Number(category.categoryId),
            categoryName: category.categoryName,
          }));

        setCategories(formattedCategories);

        const eventList = await contract.methods.getAllEvent().call();
        const formattedEvents = eventList
          .filter((event) => Number(event.eventId) !== 0)
          .map((event) => ({
            eventId: Number(event.eventId),
            eventName: event.eventName,
            startDateTime: Number(event.startDateTime),
            endDateTime: Number(event.endDateTime),
            categoryId: Number(event.categoryId),
            status: event.status,
            candidates: event.candidates,
          }));

          const uniqueYears = Array.from(
            new Set(
              eventList
                .filter((event) => Number(event.eventId) !== 0)
                .map((event) => new Date(Number(event.startDateTime) * 1000).getFullYear())
            )
          );
          

        setEvents(formattedEvents);

        // Fetch category names for each event
        const updatedEvents = await Promise.all(
          formattedEvents.map(async (event) => {
            const category = await contract.methods
              .getCategoryById(event.categoryId)
              .call();

            return {
              ...event,
              categoryName: category.categoryName,
            };
          })
        );

        setEvents(updatedEvents);
      } catch (error) {
        console.error("Error fetching categories and events:", error);
      }
    };

    fetchCategoriesAndEvents();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const accounts = await web3.eth.getAccounts();

      const contract = new web3.eth.Contract(
        votingContract.abi,
        contractAddress
      );

      // Convert start and end dates to Unix timestamps only if they are not null
      const startTimestamp = startDate
        ? Math.floor(new Date(startDate).getTime() / 1000)
        : null;
      const endTimestamp = endDate
        ? Math.floor(new Date(endDate).getTime() / 1000)
        : null;

      // Validate that end date is greater than start date
      if (startTimestamp && endTimestamp && endTimestamp <= startTimestamp) {
        Swal("Error", "End date must be greater than start date.", "error");
        return;
      }

      const filteredData = await Promise.all(
        events
          .filter((vote) => {
            const matchesCategory =
              selectedCategory === "0"
                ? true
                : vote.categoryId === Number(selectedCategory);

            return matchesCategory && vote.status == 5;
          })
          .map(async (vote) => {
            
            const category = await contract.methods
              .getCategoryById(vote.categoryId)
              .call();
            let candidateFound;
            for (let i = 0; i < vote.candidates.length; i++) {
              if (vote.candidates[i].win == true) {
                candidateFound = vote.candidates[i];
              }
            }

            return {
              ...vote,
              candidate: candidateFound,
              categoryName: category.categoryName,
            };
          })
      );

      // Use setFilteredVoteData to update the state
      setFilteredVoteData(filteredData);
    };

    fetchData();
  }, [events, searchKeyword, selectedCategory, startDate, endDate]);

  const formatUnixTimestamp = (timestamp) => {
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: "Asia/Kuala_Lumpur",
    }).format(Number(timestamp) * 1000); // Convert BigInt to number

    return formattedDate;
  };

  const getEventStatus = (event) => {
    const currentDate = currentDateTime;
    const startDate = event.startDateTime;
    const endDate = event.endDateTime;

    if (currentDate >= startDate && currentDate <= endDate) {
      return "In Progress";
    } else if (currentDate < startDate) {
      return "Upcoming";
    } else {
      return "Completed";
    }
  };

  return (
    <div>
      <Header />
      <div className="col-md-12 filter-container">
        <form className="d-flex mb-3">
          <select
            onChange={(event) => setSelectedCategory(event.target.value)}
            className="form-select"
            aria-label="Filter by category"
            id="filterSelect"
          >
            <option value="0">Filter by all categories</option>
            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </form>
      </div>

      <div className="card-container mt-3">
        {filteredVoteData.length === 0 ? (
          <div className="card mt-5 mb-5">
            <div className="card-body">
              <p className="no-matching-records">No matching records found</p>
            </div>
          </div>
        ) : (
          filteredVoteData.map((vote) => {
            // need delete
            const winnerName = vote.candidate
              ? vote.candidate.name
              : "No Winner";
            const imageName =
              vote.candidate && vote.candidate.imageFileName
                ? vote.candidate.imageFileName
                : "";

            console.log(winnerName);
            return (
              <div key={vote.eventId} className="card">
                <div className="card-body" style={{ margin: "auto" }}>
                  <h2>
                    {`${vote.categoryName} - ${vote.eventName}`}
                  </h2>
                  <div className="pic p-3 m-3">
                    <img
                      className={`irc_mut img-fluid circular-image`}
                      src={`${IMAGE_BASE_URL}${imageName}`}
                      alt={winnerName.name}
                    />
                  </div>
                  <p className="card-text">
                    Winner: <strong>{`${winnerName}`}</strong>
                  </p>
                  <p className="card-text">{`Start Date: ${formatUnixTimestamp(
                    vote.startDateTime
                  )}`}</p>
                  <p className="card-text">{`End Date: ${formatUnixTimestamp(
                    vote.endDateTime
                  )}`}</p>
                  <p className="card-text">{`Status: ${getEventStatus(
                    vote
                  )}`}</p>
                  {/* Add other fields as needed */}
                  <div className="btn-center-container">
                    <Link
                      to={`/voting/${vote.categoryId}/${vote.eventId}`}
                      className="btn btn-outline-success"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ElectionResult;
