import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Web3 from "web3";
import votingContract from "../../../../build/contracts/VotingSystem.json";
import { contractAddress } from "../../../../config";
import Swal from "sweetalert";
import axios from "../../api/axios";

function AddCandidate() {
  // Define state for selected category and election
  const [selectedCategoryId, setSelectedCategory] = useState("");
  const [selectedEventId, setSelectedEvent] = useState("");
  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [candidateName, setCandidateName] = useState("");
  const [candidateDesc, setCandidateDesc] = useState("");
  const [candidateStdId, setCandidateStdId] = useState("");
  const [file, setFile] = useState(null);

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

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Handle category change events
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // Fetch events when the component mounts or when selectedCategory changes
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (!selectedCategoryId) {
          // If selectedCategory is empty, exit early
          return;
        }

        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();

        const contract = new web3.eth.Contract(
          votingContract.abi,
          contractAddress
        );

        // Call the getAllCategoryEvent function in your smart contract
        const eventList = await contract.methods
          .getAllCategoryEvent(selectedCategoryId)
          .call();

        setEvents(eventList);
      } catch (error) {
        console.error("Error fetching Event:", error);
      }
    };

    // Fetch events when the component mounts or when selectedCategory changes
    fetchEvents();
  }, [selectedCategoryId]);

  const handleEventChanged = (event) => {
    setSelectedEvent(event.target.value);
  };

  // Handle category change events
  const handleCandidateNameChange = (event) => {
    setCandidateName(event.target.value.toUpperCase());
  };

  // Handle category change events
  const handleCandidateDescChange = (event) => {
    setCandidateDesc(event.target.value);
  };

  // Handle category change events
  const handleCandidateStdIdChange = (event) => {
    setCandidateStdId(event.target.value);
  };

  const handleCreateCandidate = async () => {
    let imageFileName;

    if (
      !selectedCategoryId ||
      !selectedEventId ||
      !candidateName ||
      !candidateDesc ||
      !candidateStdId
    ) {
      Swal("Error!", "All input fields must be specified.", "error");
      return;
    }

    // Check if a file is selected
    if (!file) {
      Swal("Error!", "Please select an image file.", "error");
      return;
    }

    if (candidateName.length > 50) {
      Swal("Error!", "Candidate name cannot more than 50 characters.", "error");
      return;
    }

    if (candidateDesc.length > 400) {
      Swal(
        "Error!",
        "Candidate description cannot more than 400 characters.",
        "error"
      );
      return;
    }

    if (!/^\d{7}$/.test(candidateStdId)) {
      Swal(
        "Error!",
        "Candidate's Student ID must be a numeric value with exactly 7 digits.",
        "error"
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("/upload", formData);
      imageFileName = response.data.imageFileName;

      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(
        votingContract.abi,
        contractAddress
      );

      // Check if category exists
      const categoryExists = categories.some(
        (category) => Number(category.categoryId) === Number(selectedCategoryId)
      );
      console.log("eventExists", categoryExists);
      if (!categoryExists) {
        Swal("Error!", "Selected category does not exist.", "error");
        await deleteImageFile(imageFileName);
        return;
      }

      //Check if event exists
      const eventExists = events.some(
        (event) => Number(event.eventId) === Number(selectedEventId)
      );
      if (!eventExists) {
        Swal("Error!", "Selected event does not exist.", "error");
        await deleteImageFile(imageFileName);
        return;
      }

      // Check if the student ID is unique
      const candidates = await contract.methods
        .getAllCandidatesInEvent(selectedCategoryId, selectedEventId)
        .call();
      const studentExists = candidates.some(
        (candidate) => Number(candidate.studentId) === Number(candidateStdId)
      );
      if (studentExists) {
        Swal(
          "Error!",
          "Student ID already exists in the selected event.",
          "error"
        );

        await deleteImageFile(imageFileName);

        return;
      }

      const eventFound = await contract.methods
        .getEventById(selectedCategoryId, selectedEventId)
        .call();

      // Validate if the candidates can add
      const isStatusValid =
        Number(eventFound.status) === 1 || Number(eventFound.status) === 2;
      console.log("eventExists", eventFound);

      if (!isStatusValid) {
        Swal(
          "Error!",
          "Cannot edit event when the event is processing, marking winner or completed.",
          "error"
        );

        await deleteImageFile(imageFileName);
        return;
      }

      await contract.methods
        .addCandidateToEvent(
          selectedCategoryId,
          selectedEventId,
          candidateName,
          candidateDesc,
          Number(candidateStdId),
          imageFileName
        )
        .send({ from: accounts[0] });

      Swal({
        icon: "success",
        title: "Candidate Created!",
        text: "You've successfully added a new candidate.",
      });
    } catch (error) {
      let errorMessage = "An error occurred while creating the candidate.";
      // Check if the error message includes a revert
      if (error.response && error.response.data) {
        // Extracting and displaying the specific message from the Node.js server
        errorMessage = error.response.data.message || error.response.data;
      } else if (error.message) {
        if (error.message.includes("revert")) {
          // Handling smart contract revert message
          const matches = error.message.match(/revert (.+)/);
          errorMessage =
            matches && matches[1]
              ? matches[1]
              : "Transaction reverted without a reason.";
        } else {
          errorMessage = error.message;
        }
      }

      Swal({
        icon: "error",
        title: "Error creating candidate!",
        text: errorMessage,
      });
    }
  };

  // Define the function to delete the file
  async function deleteImageFile(imageFileName) {
    try {
      await axios.delete("/deleteFile", {
        data: { filename: imageFileName },
      });
    } catch (deleteError) {
      console.error("Error deleting the file:", deleteError);
    }
  }

  return (
    <div className="d-flex flex-column align-items-center pt-4">
      <h2>Add Candidate</h2>
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
          <label htmlFor="eventSelect" className="form-label">
            Position
          </label>
          <select
            id="eventSelect"
            className="form-select"
            value={selectedEventId}
            onChange={handleEventChanged}
          >
            <option value="" disabled>
              Select a event
            </option>
            {events.map((event) => (
              <option key={Number(event.eventId)} value={Number(event.eventId)}>
                {event.eventName}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12">
          <label htmlFor="inputname4" className="form-label">
            Candidate Name
          </label>
          <input
            type="text"
            className="form-control"
            id="inputname4"
            placeholder="Enter First Name (eg: Ng Hooi Seng)"
            value={candidateName}
            onChange={handleCandidateNameChange}
          />
        </div>

        <div className="col-12">
          <label htmlFor="inputDescription4" className="form-label">
            Student ID
          </label>
          <input
            type="number"
            className="form-control"
            id="inputDescription4"
            placeholder="Enter Student ID"
            value={candidateStdId}
            onChange={handleCandidateStdIdChange}
          />
        </div>

        <div className="col-12">
          <label htmlFor="inputDescription4" className="form-label">
            Description
          </label>
          <input
            type="text"
            className="form-control"
            id="inputDescription4"
            placeholder="Enter Candidate Description"
            value={candidateDesc}
            onChange={handleCandidateDescChange}
          />
        </div>

        <div className="col-12 mb-3">
          {/* Display the image if the URL is set */}
          <label htmlFor="inputGroupFile01" className="form-label">
            Select Image
          </label>
          <input
            type="file"
            className="form-control"
            id="inputGroupFile01"
            onChange={handleFileChange}
          />
        </div>
        <div className="col-12">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleCreateCandidate}
          >
            Create
          </button>
        </div>
      </form>
      <Link to="/admin/candidate" className="btn btn-secondary mb-3">
        Back
      </Link>
    </div>
  );
}

export default AddCandidate;
