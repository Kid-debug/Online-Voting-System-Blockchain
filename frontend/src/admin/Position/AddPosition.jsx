import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Web3 from "web3";
import votingContract from "../../../../build/contracts/VotingSystem.json";
import { contractAddress } from "../../../../config";
import Swal from "sweetalert";

function AddPosition() {
  const [positionName, setPositionName] = useState("");
  const [positionDesc, setPositionDesc] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [startDateAndTime, setStartDateAndTime] = useState("");
  const [endDateAndTime, setEndDateAndTime] = useState("");
  const [categories, setCategories] = useState([]);
  const [currentDateTime, setCurrentDatetTime] = useState();

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
  }, []); // The empty dependency array ensures that this effect runs once, similar to componentDidMount

  const handlePositionChange = (event) => {
    setPositionName(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategoryId(event.target.value);
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

  const handleCreatePosition = async () => {
    // Your logic to create a position goes here
    console.log("Position created:", positionName);
    console.log("Selected Category ID:", selectedCategoryId);
    try {
      // Ensure that positionName and selectedCategoryId are not empty
      if (!positionName || !positionDesc || !selectedCategoryId) {
        Swal("Error!", "All input fields must be filled in.", "error");
        return;
      }

      // Check validation first
      const validationMessage = validationOnDateTime();
      if (validationMessage) {
        // If there is a validation message, show it and return early
        Swal("Error!", validationMessage, "error");
        return;
      }

      // Connect to the web3 provider (assuming MetaMask is installed)
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const accounts = await web3.eth.getAccounts();
      console.log("contract address", contractAddress);

      const contract = new web3.eth.Contract(
        votingContract.abi,
        contractAddress
      );

      const startDateTime = new Date(startDateAndTime).getTime() / 1000;
      const endDateTime = new Date(endDateAndTime).getTime() / 1000;

      // Perform the necessary action, e.g., sending a transaction
      const transaction = await contract.methods
        .addEvent(
          selectedCategoryId,
          positionName,
          positionDesc,
          startDateTime,
          endDateTime
        )
        .send({
          from: accounts[0], // Assuming the user's account is the first account
        });
      // prompt success message
      Swal({
        icon: "success",
        title: "Position Created!",
        text: "You've successfully added a new position.",
      });
      // Handle success
      console.log("Transaction successful:", transaction);
    } catch (error) {
      let errorMessage = "An error occurred while creating the position.";
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
        title: "Error creating position!",
        text: errorMessage,
      });
    }
  };

  return (
    <div className="d-flex flex-column align-items-center pt-4">
      <h2>Add Position</h2>
      <form className="row g-3 w-50">
        <div className="col-12">
          <label htmlFor="selectCategory" className="form-label">
            Select Category
          </label>
          <select
            id="selectCategory"
            className="form-select"
            value={selectedCategoryId}
            onChange={handleCategoryChange}
          >
            <option value="" disabled>
              Select a category
            </option>
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
            type="button"
            className="btn btn-primary"
            onClick={handleCreatePosition}
          >
            Create
          </button>
        </div>
      </form>
      <Link to="/admin/position" className="btn btn-secondary mb-3">
        Back
      </Link>
    </div>
  );
}

export default AddPosition;
