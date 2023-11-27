import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function EditFeedback() {
  const [electionName, setElectionName] = useState("Ng Hooi Seng");
  const [contentDescription, setContentDescription] = useState(
    "The voting process was smooth and easy to use."
  );
  const [startDate, setStartDate] = useState(new Date()); // Default to today's date
  const [endDate, setEndDate] = useState(new Date()); // Default to today's date
  const [status, setStatus] = useState("Mark as Reviewed");

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // You can handle the form submission here, including sending the selected data to your backend.
    console.log("Election Name:", electionName);
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
    console.log("Status:", status);
  };

  // Calculate and set the default end date to one week from today
  useEffect(() => {
    const oneWeekFromToday = new Date();
    oneWeekFromToday.setDate(oneWeekFromToday.getDate() + 7);
    setEndDate(oneWeekFromToday);
  }, []);

  return (
    <div className="d-flex flex-column align-items-center pt-4">
      <h2>Edit Feedback</h2>
      <form className="row g-3 w-50" onSubmit={handleSubmit}>
        <div className="col-12">
          <label htmlFor="inputElectionname" className="form-label">
            User Name
          </label>
          <input
            type="text"
            className="form-control"
            id="inputElectionname"
            placeholder="Enter your election name"
            value={electionName}
            onChange={(e) => setElectionName(e.target.value)}
            disabled={true} // Disable the input field
          />
        </div>
        <div className="col-12">
          <label htmlFor="inputElectiondesc" className="form-label">
            Content Description
          </label>
          <input
            type="text"
            className="form-control"
            id="inputElectiondesc"
            placeholder="Enter your election name"
            value={contentDescription}
            onChange={(e) => setContentDescription(e.target.value)}
            disabled={true} // Disable the input field
          />
        </div>
        <div className="col-12">
          <label htmlFor="startDatePicker" className="form-label">
            Start Date:
          </label>
          <br />
          <DatePicker
            id="startDatePicker"
            selected={startDate}
            onChange={handleStartDateChange}
            className="form-control"
            disabled={true} // Disable the DatePicker component
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
            onChange={handleStatusChange}
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
      <Link to="/admin/adminfeedback" className="btn btn-secondary mb-3">
        Back
      </Link>
    </div>
  );
}

export default EditFeedback;
