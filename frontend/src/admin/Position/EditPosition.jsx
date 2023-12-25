import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Web3 from "web3";
import votingContract from "../../../../build/contracts/VotingSystem.json";
import { contractAddress } from "../../../../config";
import Swal from "sweetalert";

function EditPosition() {
  const [positionName, setPositionName] = useState("");
  const [positionDesc, setPositionDesc] = useState("");
  const [selectedCategoryId, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [startDateAndTime, setStartDateAndTime] = useState("");
  const [endDateAndTime, setEndDateAndTime] = useState("");
  const [currentDateTime, setCurrentDatetTime] = useState();

  const { categoryId, eventId } = useParams();

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

  // Handle category change events
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handlePositionChange = (event) => {
    setPositionName(event.target.value.toUpperCase());
  };

  const handlePositonDescChange = (event) => {
    setPositionDesc(event.target.value);
  };

  const handleStartDateAndTimeChange = (event) => {
    setStartDateAndTime(event.target.value);
  };

  const handleEndDateAndTimeChange = (event) => {
    setEndDateAndTime(event.target.value);
  };

  const validationOnDateTime = () => {
    const startDateTime = new Date(startDateAndTime).getTime() / 1000;
    const endDateTime = new Date(endDateAndTime).getTime() / 1000;

    if (currentDateTime > startDateTime) {
      return "Start Date Time cannot be set before the current date time.";
    }

    if (currentDateTime >= endDateTime) {
      return "End Date Time cannot be set before or the same as the current date time.";
    }

    if (startDateTime >= endDateTime) {
      return "End Date Time cannot be set before or the same as the start date time.";
    }

    return ""; // Return an empty string if there are no validation errors
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

      setSelectedCategory(Number(event.categoryId));
      setPositionName(event.eventName);
      setPositionDesc(event.eventDesc);
      // Convert BigInt timestamps to ISO format for datetime-local input
      if (!isNaN(Number(event.startDateTime))) {
        setStartDateAndTime(
          formatUnixTimestamp(Number(event.startDateTime), true)
        );
      } else {
        console.error("Invalid startDateTime:", event.startDateTime);
      }

      if (!isNaN(Number(event.endDateTime))) {
        setEndDateAndTime(formatUnixTimestamp(Number(event.endDateTime), true));
      } else {
        console.error("Invalid endDateAndTime:", event.endDateTime);
      }
    } catch (error) {
      console.error("Error fetching Event:", error);
    }
  };

  // Fetch events when the component mounts or when selectedCategory changes
  useEffect(() => {
    // Fetch events when the component mounts or when selectedCategory changes
    fetchEventDetails();
  }, [categoryId, eventId]);

  useEffect(() => {
    // Fetch categories when the component mounts
    const fetchCategories = async () => {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();

        const contract = new web3.eth.Contract(
          votingContract.abi,
          contractAddress
        );

        // Call the getAllCategory function in your smart contract
        const categoryList = await contract.methods.getAllCategory().call();
        const formattedCategories = categoryList.filter(
          (category) => Number(category.categoryId) !== 0
        );

        setCategories(formattedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleEditPosition = async (event) => {
    event.preventDefault();
    // check the event status

    const eventFound = await contract.methods
      .getEventById(categoryId, eventId)
      .call();

    // Ensure that positionName and selectedCategoryId are not empty
    if (
      !positionName ||
      !positionDesc ||
      !selectedCategoryId ||
      !startDateAndTime ||
      !endDateAndTime
    ) {
      Swal("Error!", "All input fields must be filled in.", "error");
      return;
    }

    if (positionName.length > 20) {
      Swal("Error!", "Position name cannot more than 20 characters.", "error");
      return;
    }

    if (positionDesc.length > 100) {
      Swal(
        "Error!",
        "Position description cannot more than 100 characters.",
        "error"
      );
      return;
    }

    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(votingContract.abi, contractAddress);

    const allEvents = await contract.methods.getAllEvent().call();
    const events = allEvents.find(
      (event) =>
        Number(event.categoryId) === selectedCategoryId &&
        String(event.eventId) === eventId
    );

    console.log(selectedCategoryId, eventId);
    console.log(events);
    console.log(events.status);

    // Check if the event exists
    if (!events) {
      Swal({
        icon: "error",
        title: "Error Editing Event!",
        text: "Event not found.",
      });
      return;
    }

    // Check if the event name cannot be the same with others except for itself
    const isEventNameTaken = allEvents.some(
      (evt) =>
        evt.eventName === positionName &&
        String(evt.eventId) !== eventId &&
        Number(evt.categoryId) === Number(selectedCategoryId)
    );

    if (isEventNameTaken) {
      Swal(
        "Error!",
        "Event name already taken in this category. Please choose a different name.",
        "error"
      );
      return;
    }

    // Validate if the event can be edited
    const isStatusValid =
      Number(events.status) === 1 || Number(events.status) === 2;

    if (!isStatusValid) {
      Swal(
        "Error!",
        "Cannot edit event when the event is processing, marking winner or completed.",
        "error"
      );
      return;
    }

    // Check validation first
    const validationMessage = validationOnDateTime();
    if (validationMessage) {
      // If there is a validation message, show it and return early
      Swal("Error!", validationMessage, "error");
      return;
    }

    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(
        votingContract.abi,
        contractAddress
      );

      const startDateTime = new Date(startDateAndTime).getTime() / 1000;
      const endDateTime = new Date(endDateAndTime).getTime() / 1000;

      await contract.methods
        .updateEventDetails(
          selectedCategoryId,
          eventId,
          positionName,
          positionDesc,
          startDateTime,
          endDateTime
        )
        .send({ from: accounts[0] });

      Swal("Success!", "Position updated successfully.", "success");
    } catch (error) {
      console.error("Updating Position error:", error);

      let errorMessage = "An error occurred while updating the position.";
      // Check if the error message includes a revert
      if (error.message && error.message.includes("revert")) {
        const matches = error.message.match(/revert (.+)/);
        errorMessage =
          matches && matches[1]
            ? matches[1]
            : "Transaction reverted without a reason.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      Swal({
        icon: "error",
        title: "Error updating position!",
        text: errorMessage,
      });
    }
  };

  const formatUnixTimestamp = (timestamp, forInput = false) => {
    const date = new Date(timestamp * 1000); // Convert timestamp to milliseconds

    if (forInput) {
      // Adjust the time for the local timezone
      const localDateTime = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      );
      const isoDateTime = localDateTime.toISOString();
      return isoDateTime.slice(0, 16); // Extract YYYY-MM-DDTHH:mm
    } else {
      // Format for display
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZone: "Asia/Kuala_Lumpur",
      }).format(date);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center pt-4">
      <h2>Edit Position</h2>
      <form className="row g-3 w-50">
        <div className="col-12">
          <label htmlFor="electionSelect" className="form-label">
            Category
          </label>
          <select
            id="electionSelect"
            className="form-select"
            value={selectedCategoryId}
            onChange={handleCategoryChange}
            disabled="true"
          >
            {categories.map((category) => (
              <option
                key={Number(category.categoryId)}
                value={Number(category.categoryId)}
              >
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12">
          <label htmlFor="inputPositionname" className="form-label">
            Position Name
          </label>
          <input
            type="text"
            className="form-control"
            id="inputPositionname"
            placeholder="Enter your position name (e.g., President)"
            value={positionName}
            onChange={handlePositionChange}
          />
        </div>
        <div className="col-12">
          <label htmlFor="inputDescription4" className="form-label">
            Position Description
          </label>
          <input
            type="text"
            className="form-control"
            id="inputDescription4"
            placeholder="Enter your position description"
            value={positionDesc}
            onChange={handlePositonDescChange}
          />
        </div>
        <div className="col-12">
          <label htmlFor="inputStartDateAndTime" className="form-label">
            Start Date and Time
          </label>
          <input
            type="datetime-local"
            className="form-control"
            id="inputStartDateAndTime"
            value={startDateAndTime}
            onChange={handleStartDateAndTimeChange}
          />
        </div>
        <div className="col-12">
          <label htmlFor="inputEndDateAndTime" className="form-label">
            End Date and Time
          </label>
          <input
            type="datetime-local"
            className="form-control"
            id="inputEndDateAndTime"
            value={endDateAndTime}
            onChange={handleEndDateAndTimeChange}
          />
        </div>
        <div className="col-12">
          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleEditPosition}
          >
            Edit
          </button>
        </div>
      </form>
      <Link to="/admin/position" className="btn btn-secondary mb-3">
        Back
      </Link>
    </div>
  );
}

export default EditPosition;
