import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Web3 from "web3";
import votingContract from "../../../../build/contracts/VotingSystem.json";
import { contractAddress } from "../../../../config";
import Swal from "sweetalert";

function AddPosition() {
  const [positionName, setPositionName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [startDateAndTime, setStartDateAndTime] = useState("");
  const [endDateAndTime, setEndDateAndTime] = useState("");
  const [categories, setCategories] = useState([]);

  function getCurrentDateTimeInMalaysia() {
    // Get the current date and time in UTC
    const now = new Date();
    // Convert it to Malaysia time (UTC+8)
    const malaysiaTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    // Format the date and time to be suitable for the datetime-local input
    const formattedDateTime = malaysiaTime.toISOString().slice(0, 16);
    return formattedDateTime;
  }

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
    setStartDateAndTime(getCurrentDateTimeInMalaysia());
    setEndDateAndTime(getCurrentDateTimeInMalaysia());
  }, []); // The empty dependency array ensures that this effect runs once, similar to componentDidMount

  const handlePositionChange = (event) => {
    setPositionName(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategoryId(event.target.value);
  };

  const handleStartDateAndTimeChange = (event) => {
    setStartDateAndTime(event.target.value);
  };

  const handleEndDateAndTimeChange = (event) => {
    setEndDateAndTime(event.target.value);
  };

  const handleCreatePosition = async () => {
    // Your logic to create a position goes here
    console.log("Position created:", positionName);
    console.log("Selected Category ID:", selectedCategoryId);
    try {
      // Ensure that positionName and selectedCategoryId are not empty
      if (!positionName || !selectedCategoryId) {
        Swal(
          "Error!",
          "Position name and category must be specified.",
          "error"
        );
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

      // Perform the necessary action, e.g., sending a transaction
      const transaction = await contract.methods
        .addEvent(selectedCategoryId, positionName)
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
