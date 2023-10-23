import React from "react";
import { Link } from "react-router-dom";

function EditPosition() {
  return (
    <div className="d-flex flex-column align-items-center pt-4">
      <h2>Update Position</h2>
      <form class="row g-3 w-50">
        <div class="col-12">
          <label htmlFor="inputPositionname" className="form-label">
            Position Name
          </label>
          <input
            type="text"
            className="form-control"
            id="inputPositionname"
            placeholder="Enter Position Name (eg: Vice President)"
            value="President"
          />
        </div>
        <div class="col-12">
          <label htmlFor="inputPositiondescription" className="form-label">
            Position Description
          </label>
          <input
            type="text"
            className="form-control"
            id="inputPositiondescription"
            placeholder="Enter Position Description"
            value="The President is responsible for leading the SRC, representing student interests, and overseeing SRC activities."
          />
        </div>
        <div class="col-12">
          <label htmlFor="inputMaximumcandidates" className="form-label">
            Maximum Candidates
          </label>
          <input
            type="text"
            className="form-control"
            id="inputMaximumcandidates"
            placeholder="Enter your maximum candidates number (eg: 5)"
            value="5"
          />
        </div>
        <div class="col-12">
          <button type="submit" class="btn btn-primary">
            Edit
          </button>
        </div>
      </form>
      <Link to="/position" className="btn btn-secondary mb-3">
        Back
      </Link>
    </div>
  );
}

export default EditPosition;
