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
import Select from "react-select";
import "./stylesheets/voterhome.css";

function ElectionResult() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("0"); // "0" represents "All"
  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [allEventYears, setAllEventYears] = useState();
  const [currentDateTime, setCurrentDateTime] = useState();
  const [filteredVoteData, setFilteredVoteData] = useState([]);
  const IMAGE_BASE_URL = "http://localhost:3000/uploads/";
  const [expandedDescription, setExpandedDescription] = useState({});

  const optionsCategory = categories.map((category) => ({
    value: category.categoryId,
    label: category.categoryName,
  }));

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

        // const uniqueYears = Array.from(
        //   new Set(
        //     eventList
        //       .filter((event) => Number(event.eventId) !== 0)
        //       .map((event) =>
        //         new Date(Number(event.startDateTime) * 1000).getFullYear()
        //       )
        //   )
        // );
        // setAllEventYears(uniqueYears);
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
                ? false
                : vote.categoryId === Number(selectedCategory);

            const matchyear =
              selectedYear === null
                ? true
                : getYearFromUnixTimestamp(vote.startDateTime) ===
                  selectedYear.getFullYear();
            console.log(
              "selectedYear",
              getYearFromUnixTimestamp(vote.startDateTime)
            );
            return matchesCategory && vote.status == 5 && matchyear;
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
  }, [events, selectedYear, selectedCategory, startDate, endDate]);

  function getYearFromUnixTimestamp(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000); // Convert Unix timestamp to milliseconds
    return date.getFullYear();
  }

  // Functions for President candidates
  const handleReadMoreClick = (candidateName) => {
    setExpandedDescription((prevState) => ({
      ...prevState,
      [candidateName]: !prevState[candidateName],
    }));
  };

  const handleOnChangeCategory = (selectedOption) => {
    setSelectedCategory(selectedOption.value);
  };

  return (
    <div className="voterhome">
      <Header />
      <div style={{ margin: "20px" }}>
        <h1>Election Result</h1>
      </div>
      <div className="col-md-12 filter-container">
        <form className="d-flex mb-3">
          <h3>Select Category : </h3>
          <Select
            options={optionsCategory}
            onChange={handleOnChangeCategory}
            value={optionsCategory.find(
              (option) => option.value === selectedCategory
            )}
            placeholder="Filter by all categories"
            style={{ width: "200%" }}
          />
        </form>
        <div className="date-picker-container">
          <h3>
            Select Year :
            <DatePicker
              className="form-control"
              selected={selectedYear}
              onChange={(date) => setSelectedYear(date)}
              placeholderText="Click to select year"
              showYearPicker
              dateFormat="yyyy"
            />
          </h3>
        </div>
      </div>

      <div className="card-container mt-3">
        {filteredVoteData.length === 0 ? (
          <div className="card mt-5 mb-5">
            <div className="card-body">
              <p className="no-matching-records">Does not found the record.</p>
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

            return (
              <div key={vote.eventId} className="card">
                <div className="card-body" style={{ margin: "auto" }}>
                  <div style={{ margin: "auto", textAlign: "center" }}>
                    <h2>{` ${vote.eventName}`}</h2>
                    <div className="pic p-3 m-3">
                      <img
                        className={`irc_mut img-fluid circular-image`}
                        src={`${IMAGE_BASE_URL}${imageName}`}
                        alt={winnerName.name}
                      />
                    </div>
                    {/* name */}
                    <p className="card-text" style={{ fontSize: "150%" }}>
                      <strong>{`${winnerName}`}</strong>
                    </p>
                    {/* student id */}
                    <p className="card-text" style={{ fontSize: "120%" }}>
                      {`${vote.candidate.studentId}`}
                    </p>
                    {/* description */}
                    <p className="card-text" style={{ width: "100%" }}>
                      {expandedDescription[vote.candidate.name] ||
                      vote.candidate.description.length <= 50
                        ? vote.candidate.description
                        : vote.candidate.description.slice(0, 50) + "..."}
                      {vote.candidate.description.length > 30 && (
                        <a
                          href="#"
                          onClick={() =>
                            handleReadMoreClick(vote.candidate.name)
                          }
                        >
                          {expandedDescription[vote.candidate.name]
                            ? " Read Less"
                            : " Read More"}
                        </a>
                      )}
                    </p>
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
