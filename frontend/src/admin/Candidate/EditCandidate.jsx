import React, { useState } from "react";
import { Link } from "react-router-dom";

function EditCandidate() {
  // Define state for selected category and election
  const [selectedCategory, setSelectedCategory] = useState("President");
  const [selectedElection, setSelectedElection] = useState(
    "2023 Presidential Election"
  );

  // Define options for categories and elections
  const categoryOptions = [
    "President",
    "Vice President",
    "Secretary",
    "Treasurer",
    "Committee Member",
  ];
  const electionOptions = [
    "2023 SRC Election",
    "2023 FOCS Presidential Election",
    "2023 FAFB Election",
    "2024 FOCS Election",
    "2025 FOCS Member Election",
    "2026 FOCS Member Election",
  ];

  // Handle category and election change events
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleElectionChange = (event) => {
    setSelectedElection(event.target.value);
  };

  return (
    <div className="d-flex flex-column align-items-center pt-4">
      <h2>Update Candidate</h2>
      <form class="row g-3 w-50">
        <div class="col-12">
          <label htmlFor="inputname4" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="inputname4"
            placeholder="Enter Name (eg: Ng Hooi Seng)"
          />
        </div>
        <div class="col-12">
          <label htmlFor="inputUserid4" className="form-label">
            Student ID
          </label>
          <input
            type="text"
            className="form-control"
            id="inputUserid4"
            placeholder="Enter Student ID (eg: 2205578)"
          />
        </div>
        <div class="col-12">
          <label htmlFor="inputDescription4" className="form-label">
            Description
          </label>
          <input
            type="email"
            className="form-control"
            id="inputDescription4"
            placeholder="Enter Candidate Description"
          />
        </div>
        <div className="col-12">
          <label htmlFor="categorySelect" className="form-label">
            Position
          </label>
          <select
            id="categorySelect"
            className="form-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12">
          <label htmlFor="electionSelect" className="form-label">
            Election
          </label>
          <select
            id="electionSelect"
            className="form-select"
            value={selectedElection}
            onChange={handleElectionChange}
          >
            {electionOptions.map((election) => (
              <option key={election} value={election}>
                {election}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12 mb-3 d-flex flex-column align-items-start">
          <label htmlFor="inputGroupFile01" className="form-label">
            Edit Image
            <input
              type="file"
              className="visually-hidden"
              id="inputGroupFile01"
            />
          </label>
          <label htmlFor="inputGroupFile01">
            <img src="public/img1.jpg" alt="" className="image" />
          </label>
        </div>
        <div class="col-12">
          <button type="submit" class="btn btn-primary">
            Edit
          </button>
        </div>
      </form>
      <Link to="/admin/candidate" className="btn btn-secondary mb-3">
        Back
      </Link>
    </div>
  );
}

export default EditCandidate;
