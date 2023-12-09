//AdminFeedback.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios";
import "../../stylesheets/list.css";
import Swal from "sweetalert";
import votingContract from "../../../../build/contracts/VotingSystem.json";
import Web3 from "web3";
import { contractAddress } from "../../../../config";

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
      // Fetch all feedbacks from the backend
      const response = await axios.get("/api/retrieveFeedback");
      const feedbacks = response.data;

      // Initialize web3 with MetaMask's provider
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(
        votingContract.abi,
        contractAddress
      );

      // Fetch emails for each feedback and add them to the feedback object
      const feedbacksWithEmails = await Promise.all(
        feedbacks.map(async (feedback) => {
          const email = await contract.methods
            .getVoterEmailById(feedback.user_id)
            .call();
          return { ...feedback, email };
        })
      );

      setFeedbacks(feedbacksWithEmails);
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
    rating: "Rating (1-5)",
    content: "Content",
    status: "Status",
    created_at: "Created Date",
    updated_at: "Updated Date",
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

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const filterData = (feedbacks) => {
    const searchTermLower = searchTerm.toString().toLowerCase();

    return feedbacks.filter((item) => {
      // Convert all fields to string and lower case for comparison
      const idString = item.feedback_id.toString().toLowerCase();
      const emailString = item.email ? item.email.toLowerCase() : "";
      const ratingString = item.rating.toString().toLowerCase();
      const contentString = item.content.toLowerCase();
      const statusString = item.status.toLowerCase();
      const createdDateString = formatDate(item.created_at).toLowerCase();
      const updatedDateString = formatDate(item.updated_at).toLowerCase();

      // Check if the search term is included in any of the string conversions
      return (
        idString.includes(searchTermLower) ||
        emailString.includes(searchTermLower) ||
        ratingString.includes(searchTermLower) ||
        contentString.includes(searchTermLower) ||
        statusString.includes(searchTermLower) ||
        createdDateString.includes(searchTermLower) ||
        updatedDateString.includes(searchTermLower)
      );
    });
  };

  const sortedData = sortColumn
    ? filterData(feedbacks).sort((a, b) => {
        if (sortColumn === "feedback_id" || sortColumn === "rating") {
          return sortDirection === "asc"
            ? a[sortColumn] - b[sortColumn]
            : b[sortColumn] - a[sortColumn];
        } else if (sortColumn === "email") {
          const aValue = a.email && a.email ? a.email : "";
          const bValue = b.email && b.email ? b.email : "";
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else if (sortColumn === "content" || sortColumn === "status") {
          // Add custom sorting logic for content and status
          return sortDirection === "asc"
            ? a[sortColumn].localeCompare(b[sortColumn])
            : b[sortColumn].localeCompare(a[sortColumn]);
        } else if (sortColumn === "created_at" || sortColumn === "updated_at") {
          // Add custom sorting logic for date columns
          const aValue = new Date(a[sortColumn]);
          const bValue = new Date(b[sortColumn]);
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        } else {
          // Default sorting for other columns
          return sortDirection === "asc"
            ? a[sortColumn].localeCompare(b[sortColumn])
            : b[sortColumn].localeCompare(a[sortColumn]);
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
                      row.email ? (
                        row.email
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
