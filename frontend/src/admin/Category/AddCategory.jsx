import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios";
import Swal from "sweetalert";

function AddCategory() {
  const [categoryName, setCategoryName] = useState("");

  const handleAddCategory = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("/api/createCategory", {
        category_name: categoryName,
      });

      Swal({
        title: "Add Category Successfully!",
        text: response.data.msg,
        icon: "success",
        button: {
          text: "OK",
        },
      });

      setCategoryName(""); // Reset the form field
      // Optionally, redirect user or handle the success case further...
    } catch (error) {
      if (error.response) {
        // If the backend sends an array of errors
        if (error.response.data.errors) {
          Swal({
            icon: "error",
            title: "Failed to Add Category!",
            text: error.response.data.errors.map((e) => e.msg).join("\n"),
            button: {
              text: "OK",
            },
          });
        } else {
          // If the backend sends a single error message
          Swal({
            icon: "error",
            title: "Failed to Add Category!",
            text: error.response.data.msg,
            button: {
              text: "OK",
            },
          });
        }
      } else {
        // Handle other errors here
        console.error("Adding Category error:", error);
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
      <h2>Add Category</h2>
      {/* {backendErrors.length > 0 && (
        <div className="alert alert-danger" role="alert">
          {backendErrors.map((error, index) => (
            <div key={index}>{error.msg}</div>
          ))}
        </div>
      )} */}

      <form class="row g-3 w-50" onSubmit={handleAddCategory}>
        <div class="col-12">
          <label htmlFor="inputCategoryName" className="form-label">
            Category Name
          </label>
          <input
            type="text"
            className="form-control"
            id="inputCategoryName"
            placeholder="Enter your category name (e.g., Chess Club)"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </div>
        <div class="col-12">
          <button type="submit" class="btn btn-primary">
            Create
          </button>
        </div>
      </form>
      <Link to="/admin/category" className="btn btn-secondary mt-3">
        Back
      </Link>
    </div>
  );
}

export default AddCategory;
