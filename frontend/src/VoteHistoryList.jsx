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

function VoteHistoryList() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("0"); // "0" represents "All"
  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState();
  const [filteredVoteData, setFilteredVoteData] = useState([]);

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
          }));

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
            const matchesKeyword = searchKeyword
              ? vote.eventName
                  .toLowerCase()
                  .includes(searchKeyword.toLowerCase())
              : true;
            const matchesCategory =
              selectedCategory === "0"
                ? true
                : vote.categoryId === Number(selectedCategory);
            const isWithinDateRange =
              startTimestamp && endTimestamp
                ? vote.startDateTime >= startTimestamp &&
                  vote.endDateTime <= endTimestamp
                : true;

            return matchesKeyword && matchesCategory && isWithinDateRange;
          })
          .map(async (vote) => {
            const category = await contract.methods
              .getCategoryById(vote.categoryId)
              .call();

            return {
              ...vote,
              categoryName: category.categoryName,
            };
          })
      );

      // Use setFilteredVoteData to update the state
      setFilteredVoteData(filteredData);
    };

    fetchData();
  }, [events, searchKeyword, selectedCategory, startDate, endDate]);

  // const handleApply = async (dates) => {
  //   const [start, end] = dates;

  //   // Check if both start date and end date are filled in
  //   if (!start || !end) {
  //     Swal({
  //       icon: "error",
  //       title: "Oops...",
  //       text: "Please select both start date and end date.",
  //     });
  //     return;
  //   }

  //   if (end < start) {
  //     Swal("Error", "End date must be greater than start date.", "error");
  //     return;
  //   }

  //   try {
  //     const web3 = new Web3(window.ethereum);
  //     await window.ethereum.enable();
  //     const accounts = await web3.eth.getAccounts();

  //     const contract = new web3.eth.Contract(
  //       votingContract.abi,
  //       contractAddress
  //     );

  //     const startDateTime = Math.floor(start.getTime() / 1000); // Convert milliseconds to seconds
  //     const endDateTime = Math.floor(end.getTime() / 1000);

  //     console.log("Start Date:", startDateTime);
  //     console.log("End Date:", endDateTime);

  //     // Call the updated getEventsByDateRange function
  //     const eventsInRange = await contract.methods
  //       .getEventsByDateRange(startDateTime, endDateTime)
  //       .call();

  //     // Check if the response is an array and has elements
  //     if (Array.isArray(eventsInRange) && eventsInRange.length > 0) {
  //       // Fetch category names for each event
  //       const updatedEvents = await Promise.all(
  //         eventsInRange.map(async (event) => {
  //           const category = await contract.methods
  //             .getCategoryById(event.categoryId)
  //             .call();

  //           return {
  //             ...event,
  //             categoryName: category.categoryName,
  //           };
  //         })
  //       );
  //       console.log("Events within the date range:", eventsInRange);

  //       // Update the state with the filtered events
  //       setFilteredVoteData(updatedEvents);
  //     } else {
  //       // Handle the case where the response is empty
  //       console.log("No events found within the date range");
  //       setFilteredVoteData([]); // Set an empty array or handle as needed
  //     }
  //   } catch (error) {
  //     console.error("Error calling getEventsByDateRange:", error);
  //     Swal({
  //       icon: "error",
  //       title: "Oops...",
  //       text: "Error fetching events within the date range. Please try again.",
  //     });
  //   }

  //   setStartDate(start);
  //   setEndDate(end);
  //   // Implement the logic for filtering based on the selected dates
  // };

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
    <div className="voterhome">
      <Header />
      <div className="col-md-12 filter-container">
        <form className="d-flex mb-3">
          <input
            onKeyUp={(event) => setSearchKeyword(event.target.value)}
            className="form-control me-2"
            type="search"
            placeholder="Search By Position Name (eg: SRC)"
            aria-label="Search"
            id="searchBox"
          />
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
      <div className="date-range-filter mt-2">
        <label htmlFor="startDate">Start Date:</label>
        <DatePicker
          className="custom-date-picker"
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={1}
          timeCaption="time"
          dateFormat="MMMM d, yyyy h:mm aa"
        />
        <label htmlFor="startDate">End Date:</label>
        <DatePicker
          className="custom-date-picker"
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={1}
          timeCaption="time"
          dateFormat="MMMM d, yyyy h:mm aa"
        />

        {/* <button onClick={() => handleApply([startDate, endDate])}>APPLY</button> */}
      </div>
      <div className="card-container mt-3">
        {filteredVoteData.length === 0 ? (
          <div className="card mt-5 mb-5">
            <div className="card-body">
              <p className="no-matching-records">No matching records found</p>
            </div>
          </div>
        ) : (
          filteredVoteData.map((vote) => (
            <div key={vote.eventId} className="card">
              <div className="card-body">
                <h5 className="card-title">{vote.eventName}</h5>
                <p className="card-text">{`Category: ${vote.categoryName}`}</p>
                <p className="card-text">{`Start Date: ${formatUnixTimestamp(
                  vote.startDateTime
                )}`}</p>
                <p className="card-text">{`End Date: ${formatUnixTimestamp(
                  vote.endDateTime
                )}`}</p>
                <p className="card-text">{`Status: ${getEventStatus(vote)}`}</p>
                {/* Add other fields as needed */}
                <div className="btn-center-container">
                  <Link
                    to={`/result/${vote.categoryId}/${vote.eventId}`}
                    className="btn btn-outline-success"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
  );
}

export default VoteHistoryList;
