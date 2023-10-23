import React from "react";
import { Link } from "react-router-dom";

function AddVoter() {
  //left back-end part
  return (
    <div className="d-flex flex-column align-items-center pt-4">
      <h2>Add Voter</h2>
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
          <label htmlFor="inputEmail4" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="inputEmail4"
            placeholder="Enter Email (eg: nghs-wm20@student.tarc.edu.my)"
          />
        </div>
        <div class="col-12">
          <label htmlFor="inputPassword4" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="inputPassword4"
            placeholder="Enter Password (eg: Abc!1234)"
          />
        </div>
        <div class="col-12">
          <button type="submit" class="btn btn-primary">
            Create
          </button>
        </div>
      </form>
      <Link to="/voter" className="btn btn-secondary mb-3">
        Back
      </Link>
    </div>
  );
}

export default AddVoter;
