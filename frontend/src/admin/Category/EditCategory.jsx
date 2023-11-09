import React from "react";
import { Link } from "react-router-dom";

function EditCategory() {
  return (
    <div className="d-flex flex-column align-items-center pt-4">
      <h2>Update Category</h2>
      <form class="row g-3 w-50">
        <div class="col-12">
          <label htmlFor="inputCategoryname" className="form-label">
            Category Name
          </label>
          <input
            type="text"
            className="form-control"
            id="inputCategoryname"
            placeholder="Enter Category Name (eg: Vice President)"
            value="Chemistry and Biology Society"
          />
        </div>
        <div class="col-12">
          <button type="submit" class="btn btn-primary">
            Edit
          </button>
        </div>
      </form>
      <Link to="/admin/category" className="btn btn-secondary mb-3">
        Back
      </Link>
    </div>
  );
}

export default EditCategory;
