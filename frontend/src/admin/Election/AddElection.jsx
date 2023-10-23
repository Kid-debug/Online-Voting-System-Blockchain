import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function AddElection() {
  const [electionName, setElectionName] = useState("");
  const [startDate, setStartDate] = useState(new Date()); // Default to today's date
  const [endDate, setEndDate] = useState(new Date()); // Default to today's date
  const [status, setStatus] = useState("Upcoming");

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
      <h2>Add Election</h2>
      <form className="row g-3 w-50" onSubmit={handleSubmit}>
        <div className="col-12">
          <label htmlFor="inputElectionname" className="form-label">
            Election Name
          </label>
          <input
            type="text"
            className="form-control"
            id="inputElectionname"
            placeholder="Enter your election name"
            value={electionName}
            onChange={(e) => setElectionName(e.target.value)}
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
          />
        </div>
        <div className="col-12">
          <label htmlFor="endDatePicker" className="form-label">
            End Date:
          </label>
          <br />
          <DatePicker
            id="endDatePicker"
            selected={endDate}
            onChange={handleEndDateChange}
            className="form-control"
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
            <option value="Upcoming">Upcoming</option>
            <option value="In Progress">In Progress</option>
          </select>
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            Create
          </button>
        </div>
      </form>
      <Link to="/election" className="btn btn-secondary mb-3">
        Back
      </Link>
    </div>
  );
}

export default AddElection;
