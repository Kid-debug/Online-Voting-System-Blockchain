import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import Swal from "sweetalert";

function EditCategory() {
  const [categoryName, setCategoryName] = useState("");

  const navigate = useNavigate();
  const { categoryId } = useParams();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`/api/retrieveCategory/${categoryId}`);
        const category = response.data;
        setCategoryName(category.category_name);
      } catch (error) {
        console.error("Error fetching category:", error);
        navigate("/admin/category", { replace: true });
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(`/api/updateCategory/${categoryId}`, {
        category_name: categoryName,
      });

      Swal({
        title: "Update Category Successfully!",
        text: response.data.msg,
        icon: "success",
        button: {
          text: "OK",
        },
      });
    } catch (error) {
      if (error.response) {
        // If the backend sends an array of errors
        if (error.response.data.errors) {
          Swal({
            icon: "error",
            title: "Failed to Update Category!",
            text: error.response.data.errors.map((e) => e.msg).join("\n"),
            button: {
              text: "OK",
            },
          });
        } else {
          // If the backend sends a single error message
          Swal({
            icon: "error",
            title: "Failed to Update Category!",
            text: error.response.data.msg,
            button: {
              text: "OK",
            },
          });
        }
      } else {
        // Handle other errors here
        console.error("Updating Category error:", error);
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
      <h2>Update Category</h2>
      <form className="row g-3 w-50" onSubmit={handleSubmit}>
        <div class="col-12">
          <label htmlFor="inputCategoryname" className="form-label">
            Category Name
          </label>
          <input
            type="text"
            className="form-control"
            id="inputCategoryname"
            placeholder="Enter Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </div>
        <div class="col-12">
          <button type="submit" class="btn btn-primary">
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

export default EditCategory;
