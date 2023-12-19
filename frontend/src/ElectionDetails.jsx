import React, { useState, useEffect } from "react";
import Header from "./container/Header";
import Footer from "./container/Footer";
import { Link, useParams } from "react-router-dom";
import Web3 from "web3";
import votingContract from "../../build/contracts/VotingSystem.json";
import { contractAddress } from "../../config";

function ElectionDetails() {
  const { categoryId, eventId } = useParams(); // Assuming you have eventId as part of the URL params
  const [positionName, setPositionName] = useState("");
  const [positionDesc, setPositionDesc] = useState("");
  const [startDateAndTime, setStartDateAndTime] = useState("");
  const [endDateAndTime, setEndDateAndTime] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [currentDateTime, setCurrentDatetTime] = useState();
  const [status, setStatus] = useState("");

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
    // Set the initial state when the component mounts
    setStartDateAndTime(getCurrentDateTimeInMalaysia());

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
  }, []);

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

  const selectElection = (election) => {
    // Logic to select election and determine the next steps
    console.log("Selected Election:", election);
  };

  const getElectionAction = (election) => {
    if (getElectionStatus(election) === "Ongoing" && !has_voted) {
      return <button onClick={() => vote(election)}>Vote</button>;
    } else {
      return "View Details";
    }
  };

  const fetchEventDetails = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();

      const contract = new web3.eth.Contract(
        votingContract.abi,
        contractAddress
      );

      // Call the getEventById function in your smart contract
      const event = await contract.methods
        .getEventById(categoryId, eventId)
        .call();

      // Fetch category details
      const category = await contract.methods
        .getCategoryById(event.categoryId)
        .call();
      setCategoryName(category.categoryName);

      setPositionName(event.eventName);
      setPositionDesc(event.eventDesc);
      // Check the word limit (adjust as needed)
      const wordLimit = 20;
      const words = event.eventDesc.split(/\s+/);
      if (words.length > wordLimit) {
        setShowModal(true);
        setFullDescription(event.eventDesc);
        setPositionDesc(words.slice(0, wordLimit).join(" "));
      }
      // Convert BigInt to Number if necessary
      const startTimestamp = Number(event.startDateTime);
      const endTimestamp = Number(event.endDateTime);

      // Check if the timestamps are valid numbers

      setStartDateAndTime(formatUnixTimestamp(startTimestamp));
      setEndDateAndTime(formatUnixTimestamp(endTimestamp));
      setStatus(event.eventDesc);
    } catch (error) {
      console.error("Error fetching Event:", error);
    }
  };

  // Fetch events when the component mounts or when selectedCategory changes
  useEffect(() => {
    // Fetch events when the component mounts or when selectedCategory changes
    fetchEventDetails();
  }, [categoryId, eventId]);

  const getElectionStatus = (status) => {
    // 1: Upcoming, 2: In Progress, 3: Completed, 4： Cancel
    if (status == 1) {
      return "Upcoming";
    } else if (status == 2) {
      return "Processing";
    } else if (status == 3) {
      return "Marking Winner";
    } else {
      return "Complete";
    }
  };

  return (
    <div className="voterhome">
      <Header />
      <div className="wrapper-election">
        <div className="user-card">
          <div className="user-card-img"></div>
          <div className="user-card-info">
            <h2>
              <strong>{positionName}</strong>
            </h2>
            <p style={{ fontSize: "23px", wordBreak: "break-all" }}>
              <span>Description:</span> {positionDesc}
            </p>
            <p style={{ fontSize: "23px", wordBreak: "break-all" }}>
              <span>Category:</span> {categoryName}
            </p>
            <p style={{ fontSize: "23px", wordBreak: "break-all" }}>
              <span>Start Date with Time:</span> {startDateAndTime}
            </p>
            <p style={{ fontSize: "23px", wordBreak: "break-all" }}>
              <span>End Date with Time:</span> {endDateAndTime}
            </p>
            <p style={{ fontSize: "23px", wordBreak: "break-all" }}>
              <span>Status: </span> {getElectionStatus(status)}
              {/* Add logic to determine and display status */}
            </p>
            {/* Determine if the voting should be shown based on the status */}
            <Link
              className="vote-btn"
              to={`/voting/${categoryId}/${eventId}`}
              style={{
                display: "block",
                fontSize: "18px",
                margin: "20px auto", // Adjust the margin as needed
                width: "35%",
                textAlign: "center",
              }}
            >
              Proceed To Vote
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ElectionDetails;
