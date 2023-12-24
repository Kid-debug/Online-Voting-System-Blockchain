import React, { useEffect, useState } from "react";
import Header from "./container/Header";
import Footer from "./container/Footer";
import { Link } from "react-router-dom";
import axios from "./api/axios";
import "./stylesheets/electionlist.css";
import Swal from "sweetalert";
import useAuth from "./hooks/useAuth";
import Web3 from "web3";
import votingContract from "../../build/contracts/VotingSystem.json";
import { contractAddress } from "../../config";

function UserFeedbackList() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [expandedFeedback, setExpandedFeedback] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const { auth } = useAuth();
  const userId = auth.userId;

  useEffect(() => {
    const fetchEmailAndFeedbacks = async () => {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        const contract = new web3.eth.Contract(
          votingContract.abi,
          contractAddress
        );

        const userEmail = await contract.methods
          .getVoterEmailById(userId)
          .call();

        // Now that you have the email, you can fetch the user's feedback
        const response = await axios.get("/api/getUserFeedback", {
          params: { userId: userId },
        });
        const feedbacksWithEmail = response.data.map((feedback) => ({
          ...feedback,
          email: userEmail,
        }));
        setFeedbacks(feedbacksWithEmail);
      } catch (error) {
        console.error("Error fetching email and feedbacks:", error);
      }
    };

    fetchEmailAndFeedbacks();
  }, []);

  const columnMapping = {
    email: "User Email",
    content: "Content",
    status: "Status",
    created_at: "Created Date",
    Action: "Action",
  };

  const columns = ["email", "content", "status", "created_at", "Action"];

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
      const emailString = item.email ? item.email.toLowerCase() : "";
      const contentString = item.content.toLowerCase();
      const statusString = item.status.toLowerCase();
      const createdDateString = formatDate(item.created_at).toLowerCase();

      // Check if the search term is included in any of the string conversions
      return (
        emailString.includes(searchTermLower) ||
        contentString.includes(searchTermLower) ||
        statusString.includes(searchTermLower) ||
        createdDateString.includes(searchTermLower)
      );
    });
  };

  const sortedData = sortColumn
    ? filterData(feedbacks).sort((a, b) => {
        if (sortColumn === "email") {
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
        } else if (sortColumn === "created_at") {
          // Add custom sorting logic for created_at (date column)
          const aValue = new Date(a[sortColumn]);
          const bValue = new Date(b[sortColumn]);
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }
        // Add more conditions if you want to sort other columns
        return 0; // Default case, no sorting
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
  const handleBlockClick = () => {
    // Call to SweetAlert to show the modal
    Swal({
      title: "Blocked",
      text: "You have been blocked from editing this feedback.",
      icon: "warning",
      buttons: "OK",
      dangerMode: true,
    });
  };

  return (
    <div className="voterhome">
      <Header />
      <div className="feedback-container mb-5">
        <h2 className="mt-5 mb-4">Feedback List</h2>
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
        <table className="data-table feedback-table mt-4">
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
                      ) : column === "status" ? (
                        <span
                          className={`badge ${
                            row.status === "Under Review"
                              ? "badge-primary"
                              : row.status === "Mark As Reviewed"
                              ? "badge-danger"
                              : ""
                          }`}
                        >
                          {row.status}
                        </span>
                      ) : column === "Action" ? (
                        <div>
                          {row.status === "Under Review" ? (
                            <Link
                              to={`/edituserfeedback/${row.feedback_id}`}
                              className="btn btn-primary btn-sm"
                            >
                              <i className="fs-4 bi-pencil"></i>
                            </Link>
                          ) : row.status === "Mark As Reviewed" ? (
                            <button
                              onClick={handleBlockClick}
                              className="btn btn-danger btn-sm block"
                            >
                              <i className="fs-4 bi-pencil"></i>
                            </button>
                          ) : null}
                        </div>
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
      <Footer />
    </div>
  );
}

export default UserFeedbackList;
