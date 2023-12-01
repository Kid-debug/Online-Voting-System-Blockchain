//AdminFeedback.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios";
import "../../stylesheets/list.css";
import Swal from "sweetalert";

function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [expandedFeedback, setExpandedFeedback] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get("api/retrieveFeedback");
      setFeedbacks(response.data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const columnMapping = {
    feedback_id: "ID",
    email: "User Email",
    rating: "Rating",
    content: "Content",
    status: "Status",
    created_at: "Created_At",
    updated_at: "Updated_At",
    Action: "Action",
  };

  const columns = [
    "feedback_id",
    "email",
    "rating",
    "content",
    "status",
    "created_at",
    "updated_at",
    "Action",
  ];

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

  const filterData = (feedbacks) => {
    return feedbacks.filter((item) =>
      Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const sortedData = sortColumn
    ? filterData(feedbacks).sort((a, b) => {
        if (sortColumn === "feedback_id" || sortColumn === "rating") {
          // Existing code for sorting by ID or rating
        } else if (sortColumn === "email") {
          // Adjust the sort comparison for the email
          const aValue = a.User && a.User.email ? a.User.email : "";
          const bValue = b.User && b.User.email ? b.User.email : "";
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else {
          // Existing code for sorting other fields
        }
      })
    : filterData(feedbacks);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const generatePaginationButtons = () => {
    const visibleButtons = 5;
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const toggleExpand = (feedbackID) => {
    if (expandedFeedback === feedbackID) {
      setExpandedFeedback(null);
    } else {
      setExpandedFeedback(feedbackID);
    }
  };

  const handleDeleteFeedback = (feedbackId) => {
    setFeedbackToDelete(feedbackId); // Set the feedback ID to delete
    setShowDeleteConfirmation(true); // Show the confirmation prompt
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false); // Hide the confirmation prompt
    setFeedbackToDelete(null); // Reset the feedback ID to delete
  };

  const confirmDelete = async () => {
    setShowDeleteConfirmation(false); // Hide the confirmation prompt

    try {
      const deleteResponse = await axios.delete(
        `api/deleteFeedback/${feedbackToDelete}`
      );

      if (deleteResponse.status === 200) {
        Swal({
          title: "Delete Feedback Successfully!",
          text: deleteResponse.data.msg,
          icon: "success",
          button: {
            text: "OK",
          },
        });

        fetchFeedbacks();
      } else {
        // Handle non-200 responses
        Swal({
          title: "Error",
          text: "Feedback could not be deleted.",
          icon: "error",
          button: "OK",
        });
      }
    } catch (error) {
      console.error("Error deleting feedback:", error);
      Swal({
        title: "Error",
        text: "An error occurred while deleting feedback.",
        icon: "error",
        button: "OK",
      });
    }
  };

  const getConfirmationContent = () => {
    return {
      title: "Delete Feedback Confirmation",
      content: "Are you sure you want to delete this feedback?",
    };
  };

  return (
    <div className="container mt-5">
      <h2>Feedback List</h2>
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
                    {column === "created_at" || column === "updated_at" ? (
                      formatDate(row[column])
                    ) : column === "email" ? (
                      row.User ? (
                        row.User.email
                      ) : (
                        "N/A"
                      )
                    ) : column === "content" ? (
                      <>
                        {row[column].length > 50 &&
                        expandedFeedback !== row.feedback_id ? (
                          <>
                            {`${row[column].substring(0, 50)}... `}
                            <button
                              onClick={() => toggleExpand(row.feedback_id)}
                              className="btn btn-link p-0"
                            >
                              Read More
                            </button>
                          </>
                        ) : (
                          <>
                            {row[column]}
                            {row[column].length > 50 && (
                              <button
                                onClick={() => toggleExpand(row.feedback_id)}
                                className="btn btn-link p-0"
                              >
                                Read Less
                              </button>
                            )}
                          </>
                        )}
                      </>
                    ) : column === "Action" ? (
                      <>
                        <Link
                          to={`/admin/editfeedback/${row.feedback_id}`}
                          className="btn btn-primary btn-sm"
                        >
                          <i className="fs-4 bi-pencil"></i>
                        </Link>
                        <button
                          onClick={() => handleDeleteFeedback(row.feedback_id)}
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
      {feedbacks.length > 0 && (
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

export default AdminFeedback;
