import React, { useState, useEffect } from "react";
import "../../stylesheets/list.css";
import { Link } from "react-router-dom";
import axios from "../../api/axios";
import Swal from "sweetalert";

function Category() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("api/retrieveCategory");
      console.log(response.data); // Log the response to the console
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Define a mapping between API keys and display names
  const columnMapping = {
    category_id: "ID",
    category_name: "Category Name",
    Action: "Action",
  };

  // Create an array of display names based on the API keys
  const columns = ["category_id", "category_name", "Action"];

  // Function to handle sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection((prevDirection) =>
        prevDirection === "asc" ? "desc" : "asc"
      );
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Helper function to filter the data based on the search term
  // Helper function to filter the data based on the search term
  const filterData = (categories) => {
    const searchTermLower = searchTerm.toString().toLowerCase();

    return categories.filter(
      (item) =>
        item.category_id.toString().toLowerCase().includes(searchTermLower) ||
        item.category_name.toLowerCase().includes(searchTermLower)
    );
  };

  // Sort the filtered data
  const sortedData = sortColumn
    ? filterData(categories).sort((a, b) => {
        if (sortColumn === "category_id") {
          // Parse the values as numbers for numeric comparison
          const aValue = parseInt(a[sortColumn]);
          const bValue = parseInt(b[sortColumn]);

          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        } else if (sortColumn !== "Action") {
          // For non-numeric columns, use localeCompare for string comparison
          const aValue = a[sortColumn].toString();
          const bValue = b[sortColumn].toString();

          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else {
          // For "Action" column, maintain the order
          return 0;
        }
      })
    : filterData(categories);

  // Get total number of pages
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // Helper function to generate pagination buttons
  const generatePaginationButtons = () => {
    const visibleButtons = 5; // Number of visible buttons
    const totalButtons = Math.min(visibleButtons, totalPages);

    let startPage = Math.max(currentPage - Math.floor(totalButtons / 2), 1);
    const endPage = startPage + totalButtons - 1;

    if (endPage > totalPages) {
      startPage = Math.max(totalPages - totalButtons + 1, 1);
    }

    return Array.from(
      { length: totalButtons },
      (_, index) => startPage + index
    );
  };

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Change items per page
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to the first page when changing items per page
  };

  const handleDeleteCategory = (categoryId) => {
    setCategoryToDelete(categoryId);
    setShowDeleteConfirmation(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setCategoryToDelete(null);
  };

  const confirmDelete = async () => {
    setShowDeleteConfirmation(false);

    try {
      const deleteResponse = await axios.delete(
        `api/deleteCategory/${categoryToDelete}`
      );

      if (deleteResponse.status === 200) {
        Swal({
          title: "Delete Category Successfully!",
          text: deleteResponse.data.msg,
          icon: "success",
          button: {
            text: "OK",
          },
        });

        // Fetch updated categories after deletion
        fetchCategories();
      } else {
        // Handle non-200 responses
        Swal({
          title: "Error",
          text: "Category could not be deleted.",
          icon: "error",
          button: "OK",
        });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      Swal({
        title: "Error",
        text: "An error occurred while deleting category.",
        icon: "error",
        button: "OK",
      });
    }
  };

  const getConfirmationContent = () => {
    return {
      title: "Delete Category Confirmation",
      content: "Are you sure you want to delete this category?",
    };
  };

  return (
    <div className="container mt-5">
      <h2>Category List</h2>
      <Link
        to="/admin/createCategory"
        className="btn btn-success mb-3"
        style={{ marginLeft: "auto" }}
      >
        Add New Category
      </Link>
      <div className="mt-3"></div>
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text">
            <i className="bi bi-search p-1"></i>
          </span>
        </div>
        <input
          type="text"
          className="form-control p-2"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} onClick={() => handleSort(column)}>
                {columnMapping[column]}
                {sortColumn === column && (
                  <span>
                    {sortDirection === "asc" ? <>&uarr;</> : <>&darr;</>}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentItems.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center">
                No matching records found
              </td>
            </tr>
          ) : (
            currentItems.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="data-cell">
                    {column === "Action" ? (
                      <>
                        <Link
                          to={`/admin/editCategory/${row.category_id}`}
                          className="btn btn-primary btn-sm"
                        >
                          <i className="fs-4 bi-pencil"></i>
                        </Link>
                        <button
                          onClick={() => handleDeleteCategory(row.category_id)}
                          className="btn btn-danger btn-sm"
                        >
                          <i className="fs-4 bi-trash"></i>
                        </button>
                      </>
                    ) : (
                      row[column.toLowerCase()]
                    )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {showDeleteConfirmation && (
        <div className="confirm">
          <div className="confirm__window">
            <div className="confirm__titlebar">
              <span className="confirm__title">
                {getConfirmationContent().title}
              </span>
              <button className="confirm__close" onClick={cancelDelete}>
                &times;
              </button>
            </div>
            <div className="confirm__content">
              {getConfirmationContent().content}
            </div>
            <div className="confirm__buttons">
              <button
                className="confirm__button confirm__button--ok confirm__button--fill"
                onClick={confirmDelete}
              >
                OK
              </button>
              <button
                className="confirm__button confirm__button--cancel"
                onClick={cancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {categories.length > 0 && (
        <div className="pagination-buttons">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="page-button"
          >
            &#8249;&#8249;
          </button>
          {generatePaginationButtons().map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              style={{
                fontWeight: page === currentPage ? "bold" : "normal",
              }}
              className="page-button"
            >
              {page}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="page-button"
          >
            &#8250;&#8250;
          </button>
          <label>
            Items per page:
            <select
              value={itemsPerPage}
              onChange={(e) =>
                handleItemsPerPageChange(parseInt(e.target.value))
              }
              className="items-per-page-select"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </label>
        </div>
      )}
    </div>
  );
}

export default Category;
