import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios";
import Swal from "sweetalert";

function AddCandidate() {
  const [candidateName, setCandidateName] = useState("");
  const [studentId, setStudentID] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef();

  const handleImageFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAddCandidate = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("candidate_name", candidateName);
    formData.append("student_id", studentId);
    formData.append("candidate_image", file);

    try {
      const response = await axios.post("/api/createCandidate", formData);

      Swal({
        title: "Add Candidate Successfully!",
        text: response.data.msg,
        icon: "success",
        button: {
          text: "OK",
        },
      });

      // Reset the form field
      setCandidateName("");
      setStudentID("");
      setFile(null);
      fileInputRef.current.value = "";
    } catch (error) {
      if (error.response) {
        // If the backend sends an array of errors
        if (error.response.data.errors) {
          Swal({
            icon: "error",
            title: "Failed to Add Candidate!",
            text: error.response.data.errors.map((e) => e.msg).join("\n"),
            button: {
              text: "OK",
            },
          });
        } else {
          // If the backend sends a single error message
          Swal({
            icon: "error",
            title: "Failed to Add Candidate!",
            text: error.response.data.msg,
            button: {
              text: "OK",
            },
          });
        }
      } else {
        // Handle other errors here
        console.error("Adding Candidate error:", error);
        Swal({
          icon: "error",
          title: "Internal Server Error",
          text: "Network error occurred.",
          button: {
            text: "OK",
          },
        });
      }
    }
  };

  return (
    <div className="d-flex flex-column align-items-center pt-4">
      <h2>Add Candidate</h2>
      <form className="row g-3 w-50" onSubmit={handleAddCandidate}>
        <div className="col-12">
          <label htmlFor="inputCandidateName" className="form-label">
            Candidate Name
          </label>
          <input
            type="text"
            className="form-control"
            id="inputCandidateName"
            placeholder="Enter First Name (eg: Ng Hooi Seng)"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            maxLength={100}
          />
        </div>
        <div className="col-12">
          <label htmlFor="inputStudentID" className="form-label">
            Student ID
          </label>
          <input
            type="text"
            className="form-control"
            id="inputStudentID"
            placeholder="Enter Student ID (eg: 22WMR05578)"
            value={studentId}
            onChange={(e) => setStudentID(e.target.value)}
            maxLength={10}
          />
        </div>

        <div className="col-12 mb-3">
          <label htmlFor="inputCandidateImageFile" className="form-label">
            Select Image
          </label>
          <input
            type="file"
            className="form-control"
            id="inputCandidateImageFile"
            aria-label="Candidate's image"
            onChange={handleImageFile}
            ref={fileInputRef}
          />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">
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
