import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Web3 from "web3";
import votingContract from "../../../../build/contracts/VotingSystem.json";
import { contractAddress } from "../../../../config";
import Swal from "sweetalert";
import axios from "../../api/axios";

function EditCandidate() {
  // Define state for selected category and election
  const [selectedCategoryId, setSelectedCategory] = useState("");
  const [selectedEventId, setSelectedEvent] = useState("");
  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [candidateName, setCandidateName] = useState("");
  const [candidateDesc, setCandidateDesc] = useState("");
  const [candidateStdId, setCandidateStdId] = useState("");
  const [file, setFile] = useState(null);
  const [imageFileName, setImageFileName] = useState("");
  const IMAGE_BASE_URL = "http://localhost:3000/uploads/";

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Handle category change events
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleEventChanged = (event) => {
    setSelectedEvent(event.target.value);
  };

  // Handle category change events
  const handleCandidateNameChange = (event) => {
    setCandidateName(event.target.value);
  };

  // Handle category change events
  const handleCandidateDescChange = (event) => {
    setCandidateDesc(event.target.value);
  };

  // Handle category change events
  const handleCandidateStdIdChange = (event) => {
    setCandidateStdId(event.target.value);
  };

  const navigate = useNavigate();
  const { categoryId, eventId, candidateId } = useParams();

  const fetchCandidateDetails = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();

      const contract = new web3.eth.Contract(
        votingContract.abi,
        contractAddress
      );

      const candidates = await contract.methods
        .getAllCandidatesInEvent(categoryId, eventId)
        .call();

        let candidatesFound;
      for(let i =0; i<candidates.length; i++){
        if(candidates[i].id == candidateId){
          candidatesFound = candidates[i];
          break;
        }
      }
      
      setSelectedCategory(Number(candidatesFound.categoryId));
      setSelectedEvent(Number(candidatesFound.eventId));
      setCandidateName(candidatesFound.name);
      setCandidateDesc(candidatesFound.description);
      setCandidateStdId(Number(candidatesFound.studentId));
      setImageFileName(candidatesFound.imageFileName);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  useEffect(() => {
    fetchCandidateDetails();
  }, [categoryId, eventId, candidateId]);

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
        const formattedEvents = eventList.filter(
          (event) => Number(event.eventId) !== 0
        );
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching Event:", error);
      }
    };

    // Fetch events when the component mounts or when selectedCategory changes
    fetchEvents();
  }, [selectedCategoryId]);

  const handleEditCandidate = async (event) => {
    event.preventDefault();

    let imageFileNameToUse;

    if (
      !selectedCategoryId ||
      !selectedEventId ||
      !candidateName ||
      !candidateDesc ||
      !candidateStdId
    ) {
      Swal("Error!", "All input fields must be filled in.", "error");
      return;
    }
    try {
      // If a new file is selected, upload it
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post("/upload", formData);
        imageFileNameToUse = response.data.imageFileName;
      } else {
        // If no new file is uploaded, use the existing imageFileName
        imageFileNameToUse = imageFileName;
      }

      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(
        votingContract.abi,
        contractAddress
      );

      const allCandidates = await contract.methods.getAllCandidates().call();
      const candidates = allCandidates.find(
        (candidate) =>
          Number(candidate.categoryId) === selectedCategoryId &&
          Number(candidate.eventId) === selectedEventId &&
          String(candidate.id) === candidateId
      );

      console.log(selectedCategoryId, selectedEventId, candidateId);
      console.log(candidates);

      const allEvents = await contract.methods.getAllEvent().call();
      const events = allEvents.find(
        (event) =>
          Number(event.categoryId) === selectedCategoryId &&
          Number(event.eventId) === selectedEventId
      );

      console.log(events.status);

      // Check if the event exists
      if (!candidates) {
        Swal({
          icon: "error",
          title: "Error Editing Candidate!",
          text: "Candidate not found.",
        });
        await deleteImageFile(imageFileNameToUse);
        return;
      }

      //Check if the student id cannot be same with others except for itself
      const isStudentIdTaken = allCandidates.some(
        (otherCandidate) =>
          Number(otherCandidate.studentId) === Number(candidateStdId) &&
          String(otherCandidate.id) !== candidateId &&
          Number(otherCandidate.categoryId) === Number(selectedCategoryId) &&
          Number(otherCandidate.eventId) === Number(selectedEventId)
      );

      if (isStudentIdTaken) {
        Swal(
          "Error!",
          "This student ID is already taken by another candidate.",
          "error"
        );

        await deleteImageFile(imageFileNameToUse);
        return; // Exit the function if the student ID is taken
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

        await deleteImageFile(imageFileNameToUse);
        return;
      }

      await contract.methods
        .updateCandidateDetails(
          candidateId,
          candidateName,
          candidateDesc,
          Number(candidateStdId),
          selectedCategoryId,
          selectedEventId,
          imageFileNameToUse
        )
        .send({ from: accounts[0] });

      Swal("Success!", "Candidate updated successfully.", "success");

      // Delete the old image after updating the new image
      if (imageFileName && imageFileName !== imageFileNameToUse) {
        await axios.delete("/deleteFile", {
          data: { filename: imageFileName },
        });
      }

      fetchCandidateDetails();
    } catch (error) {
      let errorMessage = "An error occurred while updating the category.";
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
        title: "Error updating candidate!",
        text: errorMessage,
      });

      // Check if the image file name is used by any candidate
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(
        votingContract.abi,
        contractAddress
      );
      const imageInUse = await contract.methods
        .isImageFileNameUsed(imageFileNameToUse)
        .call();

      // If the image file name is not in use, delete the file
      if (!imageInUse && error.message) {
        try {
          await axios.delete("/deleteFile", {
            data: { filename: imageFileNameToUse },
          });
        } catch (deleteError) {
          console.error("Error deleting the file:", deleteError);
        }
      }
    }
  };

  // Define the function to delete the file
  async function deleteImageFile(imageFileName) {
    // Check if the image file name is used by any candidate
    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(votingContract.abi, contractAddress);
    const imageInUse = await contract.methods
      .isImageFileNameUsed(imageFileName)
      .call();

    // If the image file name is not in use, delete the file
    if (!imageInUse) {
      try {
        await axios.delete("/deleteFile", {
          data: { filename: imageFileName },
        });
      } catch (deleteError) {
        console.error("Error deleting the file:", deleteError);
      }
    }
  }

  return (
    <div className="d-flex flex-column align-items-center pt-4">
      <h2>Update Candidate</h2>
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
          <label htmlFor="eventSelect" className="form-label">
            Position
          </label>
          <select
            id="eventSelect"
            className="form-select"
            value={selectedEventId}
            onChange={handleEventChanged}
            disabled="true"
          >
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
        <div className="col-12 d-flex flex-column align-items-start">
          <label htmlFor="inputCandidateImageFile" className="form-label">
            Edit Image
            <div>
              {" "}
              <label htmlFor="inputCandidateImageFile">
                <img
                  src={`${IMAGE_BASE_URL}${imageFileName}`}
                  alt={imageFileName}
                  className="image"
                />
              </label>
            </div>
            <input
              type="file"
              className="form-control"
              id="inputCandidateImageFile"
              onChange={handleFileChange}
            />
          </label>
        </div>
        <div className="col-12">
          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleEditCandidate}
          >
            Edit
          </button>
        </div>
      </form>
      <button onClick={() => navigate(-1)} className="btn btn-secondary mb-3">
        Back
      </button>
    </div>
  );
}

export default EditCandidate;
