import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import Swal from "sweetalert";
import votingContract from "../../../../build/contracts/VotingSystem.json";
import Web3 from "web3";
import { contractAddress } from "../../../../config";

function EditFeedback() {
  const [userEmail, setUserEmail] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [createdDate, setCreatedDate] = useState("");
  const [status, setStatus] = useState("");

  const navigate = useNavigate();
  const { feedbackId } = useParams();

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchFeedbackAndEmail = async () => {
      try {
        // Fetch feedback details from your API
        const response = await axios.get(`/api/retrieveFeedback/${feedbackId}`);
        const feedback = response.data;

        // Initialize web3 and the contract to fetch the email
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const contract = new web3.eth.Contract(
          votingContract.abi,
          contractAddress
        );

        // Assuming that feedback object includes a user_id property
        const userEmail = await contract.methods
          .getVoterEmailById(feedback.user_id)
          .call();

        // Set the state with the fetched data
        setUserEmail(userEmail);
        setContent(feedback.content);
        setRating(feedback.rating);
        const formattedDate = formatDate(feedback.created_at);
        setCreatedDate(formattedDate);
        setStatus(feedback.status);
      } catch (error) {
        console.error("Error fetching feedback and email:", error);
        navigate("/admin/adminfeedback", { replace: true });
      }
    };

    if (feedbackId) {
      fetchFeedbackAndEmail();
    }
  }, [feedbackId, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(`/api/updateFeedback/${feedbackId}`, {
        status: status,
      });
      if (response.status === 200) {
        Swal({
          title: "Update Feedback Successfully!",
          text: response.data.msg,
          icon: "success",
          button: {
            text: "OK",
          },
        });
      } else {
        // Handle non-200 responses
        Swal({
          title: "Error",
          text: "Feedback failed to update.",
          icon: "error",
          button: "OK",
        });
      }
    } catch (error) {
      console.error("Error deleting feedback:", error);
      Swal({
        title: "Error",
        text: "An error occurred while updating feedback.",
        icon: "error",
        button: "OK",
      });
    }
  };

  return (
    <div className="d-flex flex-column align-items-center pt-4">
      <h2>Edit Feedback</h2>
      <form className="row g-3 w-50" onSubmit={handleSubmit}>
        <div className="col-12">
          <label htmlFor="inputUseremail" className="form-label">
            User Email
          </label>
          <input
            type="email"
            className="form-control"
            id="inputUseremail"
            name="inputUseremail"
            value={userEmail}
            disabled
          />
        </div>
        <div className="col-12">
          <label htmlFor="inputContent" className="form-label">
            Content
          </label>
          <textarea
            type="text"
            className="form-control"
            id="inputContent"
            name="inputContent"
            value={content}
            disabled
          />
        </div>
        <div className="col-12">
          <label htmlFor="inputRating" className="form-label">
            Rating
          </label>
          <input
            type="number"
            className="form-control"
            id="inputRating"
            name="inputRating"
            value={rating}
            disabled
          />
        </div>
        <div className="col-12">
          <label htmlFor="inputDate" className="form-label">
            Created Date:
          </label>
          <input
            id="inputDate"
            name="inputDate"
            value={createdDate}
            className="form-control"
            disabled
          />
        </div>
        <div className="col-12">
          <label htmlFor="statusSelect" className="form-label">
            Status
          </label>
          <select
            id="statusSelect"
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Under Review">Under Review</option>
            <option value="Mark As Reviewed">Mark As Reviewed</option>
          </select>
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

export default EditFeedback;
