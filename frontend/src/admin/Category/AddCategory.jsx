import React from "react";
import { Link } from "react-router-dom";

function AddCategory() {
  return (
    <div className="d-flex flex-column align-items-center pt-4">
      <h2>Add Category</h2>
      <form class="row g-3 w-50">
        <div class="col-12">
          <label htmlFor="inputCategoryname" className="form-label">
            Category Name
          </label>
          <input
            type="text"
            className="form-control"
            id="inputCategoryname"
            placeholder="Enter your category name (eg: Chess Club)"
          />
        </div>
        <div class="col-12">
          <button type="submit" class="btn btn-primary">
            Create
          </button>
        </div>
      </form>
      <Link to="/category" className="btn btn-secondary mb-3">
        Back
      </Link>
    </div>
  );
}

export default AddCategory;
