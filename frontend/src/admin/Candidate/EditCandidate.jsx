import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import Swal from "sweetalert";

function EditCandidate() {
  const [candidateName, setCandidateName] = useState("");
  const [studentID, setStudentID] = useState("");
  const [candidateImage, setCandidateImage] = useState("");
  const [file, setFile] = useState(null);

  const handleImageFile = (e) => {
    setFile(e.target.files[0]);
  };

  const navigate = useNavigate();
  const { candidateId } = useParams();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(
          `api/retrieveCandidate/${candidateId}`
        );
        const candidate = response.data;
        setCandidateName(candidate.candidate_name);
        setStudentID(candidate.student_id);
        setCandidateImage(candidate.candidate_image);
      } catch (error) {
        console.error("Error fetching candidates:", error);
        Swal({
          icon: "error",
          title: "Failed to Fetch Candidate!",
          text: "Could not retrieve candidate data.",
          button: {
            text: "OK",
          },
        });
      }
    };

    if (candidateId) {
      fetchCandidates();
    }
  }, [candidateId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("candidate_name", candidateName);
    formData.append("student_id", studentID);
    if (file) {
      formData.append("candidate_image", file);
    }

    try {
      const response = await axios.put(
        `/api/updateCandidate/${candidateId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Swal({
        title: "Update Candidate Successfully!",
        text: response.data.msg,
        icon: "success",
        button: {
          text: "OK",
        },
      });

      // Update the candidate image to the new one
      setCandidateImage(URL.createObjectURL(file));
    } catch (error) {
      if (error.response) {
        // If the backend sends an array of errors
        if (error.response.data.errors) {
          Swal({
            icon: "error",
            title: "Failed to Update Candidate!",
            text: error.response.data.errors.map((e) => e.msg).join("\n"),
            button: {
              text: "OK",
            },
          });
        } else {
          // If the backend sends a single error message
          Swal({
            icon: "error",
            title: "Failed to Update Candidate!",
            text: error.response.data.msg,
            button: {
              text: "OK",
            },
          });
        }
      } else {
        // Handle other errors here
        console.error("Updating Candidate error:", error);
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
      <h2>Update Candidate</h2>
      <form className="row g-3 w-50" onSubmit={handleSubmit}>
        <div className="col-12">
          <label htmlFor="inputCandidateName" className="form-label">
            Candidate Name
          </label>
          <input
            type="text"
            className="form-control"
            id="inputCandidateName"
            placeholder="Enter Candidate Name"
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
            placeholder="Enter Student ID"
            value={studentID}
            onChange={(e) => setStudentID(e.target.value)}
            maxLength={10}
          />
        </div>
        <div className="col-12 mb-3 d-flex flex-column align-items-start">
          <label htmlFor="inputCandidateImageFile" className="form-label">
            Edit Image
            <input
              type="file"
              className="form-control"
              id="inputCandidateImageFile"
              onChange={handleImageFile}
            />
          </label>
          <label htmlFor="inputCandidateImageFile">
            <img src={candidateImage} alt={candidateImage} className="image" />
          </label>
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">
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
