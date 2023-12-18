import React from "react";
import "../../stylesheets/list.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import votingContract from "../../../../build/contracts/VotingSystem.json";
import Web3 from "web3";
import { contractAddress } from "../../../../config";
import Swal from "sweetalert";
import axios from "../../api/axios";

function Candidate() {
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState(null);
  const IMAGE_BASE_URL = "http://localhost:3000/uploads/";

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();

        const contract = new web3.eth.Contract(
          votingContract.abi,
          contractAddress
        );

        // Call the getAllEvent function in smart contract
        const candidatesList = await contract.methods.getAllCandidates().call();
        console.log("candidateList : ", candidatesList);
const filteredCandidates = candidatesList.filter(
        (candidate) => Number(candidate.id) !== 0
      );
      console.log(candidatesList);

        const candidatePromises = filteredCandidates.map(async (candidate) => {
          const category = await contract.methods
            .getCategoryById(candidate.categoryId)
            .call();
          const event = await contract.methods
            .getEventById(candidate.categoryId, candidate.eventId)
            .call();
          return {
            candidateId: Number(candidate.id),
            candidateName: candidate.name,
            candidateDesc: candidate.description,
            candidateVoteCount: Number(candidate.voteCount),
            candidateIsWin: String(candidate.win),
            categoryId: candidate.categoryId,
            categoryName: category.categoryName,
            eventId: candidate.eventId,
            eventStartDate: event.startDateTime,
            eventEndDate: event.endDateTime,
            eventStatus: event.status,
            eventName: event.eventName,
            imageFileName: candidate.imageFileName,
          };
        });

        // Await all the promises and then filter the results
      const formattedCandidates = await Promise.all(candidatePromises);

        console.log("Event", formattedCandidates);
        setCandidates(formattedCandidates);
      } catch (error) {
        console.error("Error fetching Candidates:", error);
      }
    };

  // Define a mapping between API keys and display names
  const columnMapping = {
    candidateId: "ID",
    categoryName: "Category Name",
    eventName: "Event Name",
    candidateName: "Candidate Name",
    candidateDesc: "Description",
    candidateVoteCount: "Vote Count",
    candidateIsWin: "Win",
    imageFileName: "Image",
    Action: "Action",
  };

  const columns = [
    "candidateId",
    "categoryName",
    "eventName",
    "candidateName",
    "candidateDesc",
    "candidateVoteCount",
    "candidateIsWin",
    "imageFileName",
    "Action",
  ];

  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleExpand = (categoryID) => {
    if (expandedCategory === categoryID) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryID);
    }
  };

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
  const filterData = (candidates) => {
    return candidates.filter((item) =>
      Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  // Sort the filtered data
  const sortedData = sortColumn
    ? filterData(candidates).sort((a, b) => {
        if (sortColumn === "ID") {
          // Parse the values as numbers for numeric comparison
          const aValue = parseInt(a[sortColumn]);
          const bValue = parseInt(b[sortColumn]);

          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        } else {
          const aValue = a[sortColumn];
          const bValue = b[sortColumn];

          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
      })
    : filterData(candidates);

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

  // Update the eventToDelete state to store both categoryId and eventId
  const handleDeleteCandidate = (
    categoryId,
    eventId,
    candidateId,
    imageFileName
  ) => {
    setCandidateToDelete({ categoryId, eventId, candidateId, imageFileName });
    setShowDeleteConfirmation(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setCandidateToDelete(null);
  };

  const confirmDelete = async () => {
    if (!candidateToDelete) return;

    const { categoryId, eventId, candidateId, imageFileName } =
      candidateToDelete;
    setShowDeleteConfirmation(false);

    console.log("candidateToDelete:", candidateToDelete);

    try {
      console.log(`Attempting to delete candidate with ID ${candidateId}`);
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const accounts = await web3.eth.getAccounts();

      const contract = new web3.eth.Contract(
        votingContract.abi,
        contractAddress
      );

      // Call the deleteCandidate function in your smart contract
      await contract.methods
        .deleteCandidate(categoryId, eventId, candidateId)
        .send({
          from: accounts[0],
        });

      // If the transaction was successful, delete the image from the server
      if (imageFileName) {
        const response = await axios.delete("/deleteFile", {
          data: { filename: imageFileName },
        });
        console.log(response.data);
      }

      console.log(`Candidate with ID ${candidateId} deleted successfully`);

      // Fetch updated candidates after deletion
      fetchCandidates();

      // Prompt success message
      Swal("Success!", "You've successfully deleted the candidate.", "success");
    } catch (error) {
      let errorMessage = "An error occurred while deleting the event.";
      // Check if the error message includes a revert
      if (error.message && error.message.includes("revert")) {
        const matches = error.message.match(/revert (.+)/);
        errorMessage =
          matches && matches[1]
            ? matches[1]
            : "Transaction reverted without a reason.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Show an alert with the error message
      Swal({
        icon: "error",
        title: "Error Deleting Candidate!",
        text: errorMessage,
      });

      // Reset the candidateToDelete state
      setCandidateToDelete(null);
    }
  };

  const getConfirmationContent = () => {
    return {
      title: "Delete Candidate Confirmation",
      content: "Are you sure you want to delete this candidate?",
    };
  };

  return (
    <div className="container mt-5">
      <h2>Candidate List</h2>
      <Link
        to="/admin/createCandidate"
        className="btn btn-success mb-3"
        style={{ marginLeft: "auto" }}
      >
        Add New Candidate
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
        {" "}
        {/* Added className to table element */}
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
          {currentItems.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="data-cell">
                  {column === "imageFileName" && row.imageFileName ? (
                    <img
                      src={`${IMAGE_BASE_URL}${row.imageFileName}`}
                      alt={row.imageFileName}
                      className="image"
                    />
                  ) : column === "Description" ? (
                    <>
                      {row[column].length > 50 &&
                      expandedCategory !== row.ID ? (
                        <>
                          {`${row[column].substring(0, 50)}... `}
                          <button
                            onClick={() => toggleExpand(row.ID)}
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
                              onClick={() => toggleExpand(row.ID)}
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
                        to={`/admin/editCandidate/${row.categoryId}/${row.eventId}/${row.candidateId}`}
                        className="btn btn-primary btn-sm"
                      >
                        <i className="fs-4 bi-pencil"></i>
                      </Link>
                      
                      <button
                        onClick={() =>
                          handleDeleteCandidate(
                            row.categoryId,
                            row.eventId,
                            row.candidateId,
                            row.imageFileName
                          )
                        }
                        className="btn btn-danger btn-sm"
                      >
                        <i className="fs-4 bi-trash"></i>
                      </button>
                    </>
                  ) : (
                    row[column]
                  )}
                </td>
              ))}
            </tr>
          ))}
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
      {candidates.length > 0 && (
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
            className="page-button" // Added className to button element
          >
            {page}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="page-button" // Added className to button element
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
            className="items-per-page-select" // Added className to select element
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

export default Candidate;
