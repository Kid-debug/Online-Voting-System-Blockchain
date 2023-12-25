import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Web3 from "web3";
import votingContract from "../../../../build/contracts/VotingSystem.json";
import { contractAddress } from "../../../../config";
import "../../stylesheets/list.css";
import Swal from "sweetalert";
import axios from "../../api/axios";

function Voter() {
  const [voters, setVoters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  useEffect(() => {
    fetchVoters();
  }, []);

  const fetchVoters = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const contract = new web3.eth.Contract(
        votingContract.abi,
        contractAddress
      );

      const voterList = await contract.methods.getAllVoter().call();
      const formattedVoters = voterList
        .filter((voter) => Number(voter.id) !== 0 && voter.role === "U")
        .map((voter) => ({
          ID: Number(voter.id),
          Email: voter.email,
          Status: voter.status,
          Role: voter.role === "U" ? "Voter" : undefined,
        }));

      setVoters(formattedVoters);
    } catch (error) {
      console.error("Error fetching voters:", error);
    }
  };

  const columns = ["ID", "Email", "Role", "Status"];

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
  const filterData = (voters) => {
    return voters.filter((item) =>
      Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  // Sort the filtered data
  const sortedData = sortColumn
    ? filterData(voters).sort((a, b) => {
        if (sortColumn === "ID") {
          return sortDirection === "asc"
            ? a[sortColumn] - b[sortColumn]
            : b[sortColumn] - a[sortColumn];
        } else {
          return sortDirection === "asc"
            ? a[sortColumn].localeCompare(b[sortColumn])
            : b[sortColumn].localeCompare(a[sortColumn]);
        }
      })
    : filterData(voters);

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

  const updateVoterStatus = async (voterId, newStatus) => {
    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(
        votingContract.abi,
        contractAddress
      );

      // Fetch the voter's email using getVoterEmailById
      const voterEmail = await contract.methods
        .getVoterEmailById(voterId)
        .call();

      await contract.methods
        .editUserStatus(voterId, newStatus)
        .send({ from: accounts[0] });

      // Send email when the status is updated
      if (newStatus === "1") {
        sendUnBannedEmail(voterEmail);
      } else if (newStatus === "2") {
        sendBannedEmail(voterEmail);
      }

      Swal("Success!", "Voter status updated successfully.", "success");
      fetchVoters(); // Refresh the voter list
    } catch (error) {
      let errorMessage = "An error occurred while updating the voter status.";
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
      Swal({
        icon: "error",
        title: "Error updating voter status!",
        text: errorMessage,
      });
    }
  };

  const sendBannedEmail = async (email) => {
    await axios.post("/api/sendEmailByBanned", {
      email,
    });
  };

  const sendUnBannedEmail = async (email) => {
    await axios.post("/api/sendEmailByUnBanned", {
      email,
    });
  };

  return (
    <div className="container mt-5">
      <h2>Voter List</h2>
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
                {column}
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
              <td colSpan={columns.length} className="text-center data-cell">
                No matching records found
              </td>
            </tr>
          ) : (
            currentItems.map((voter, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, colIndex) => {
                  // If the column is 'Status', provide a dropdown to change status
                  if (column === "Status") {
                    const isHardcodedVoter =
                      voter.Email.toLowerCase() === "voter@gmail.com";
                    const statusValue = isHardcodedVoter
                      ? "1"
                      : voter.Status.toString();
                    return (
                      <td key={colIndex} className="data-cell">
                        <select
                          className="form-select"
                          value={statusValue}
                          onChange={(e) =>
                            updateVoterStatus(voter.ID, e.target.value)
                          }
                          disabled={voter.Role !== "Voter" || isHardcodedVoter}
                        >
                          <option value="0" disabled>
                            No Verified
                          </option>
                          <option value="1">Verified</option>
                          <option value="2">Banned</option>
                        </select>
                      </td>
                    );
                  } else {
                    // For all other columns, just display the value
                    return (
                      <td key={colIndex} className="data-cell">
                        {voter[column]}
                      </td>
                    );
                  }
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {voters.length > 0 && (
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
      <Link to="/admin/home" className="btn btn-secondary mt-5">
        Back To Dashboard
      </Link>
    </div>
  );
}

export default Voter;
