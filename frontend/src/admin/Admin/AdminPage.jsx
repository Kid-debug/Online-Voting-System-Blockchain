import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Web3 from "web3";
import votingContract from "../../../../build/contracts/VotingSystem.json";
import { contractAddress } from "../../../../config";
import "../../stylesheets/list.css";
import Swal from "sweetalert";
import axios from "../../api/axios";

function AdminPage() {
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const contract = new web3.eth.Contract(
        votingContract.abi,
        contractAddress
      );

      const adminList = await contract.methods.getAllAdmin().call();
      const formattedAdmins = adminList
        .filter((admin) => Number(admin.id) !== 0)
        .map((admin) => ({
          ID: Number(admin.id),
          Email: admin.email,
          Status: admin.status,
          Role: admin.role === "A" ? "Admin" : "Super Admin",
        }));

      setAdmins(formattedAdmins);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const columns = ["ID", "Email", "Role", "Status", "Action"];

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

  const filterData = (admins) => {
    return admins.filter((admin) =>
      Object.values(admin).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  // Sort the filtered data
  const sortedData = sortColumn
    ? filterData(admins).sort((a, b) => {
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
    : filterData(admins);

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

  const handleBlockClick = () => {
    // Call to SweetAlert to show the modal
    Swal({
      title: "Blocked",
      text: "Super Admin account is restricted from updating details!",
      icon: "warning",
      buttons: "OK",
      dangerMode: true,
    });
  };

  const updateAdminStatus = async (adminId, newStatus) => {
    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(
        votingContract.abi,
        contractAddress
      );

      // Fetch the voter's email using getVoterEmailById
      const adminEmail = await contract.methods
        .getVoterEmailById(adminId)
        .call();

      await contract.methods
        .editUserStatus(adminId, newStatus)
        .send({ from: accounts[0] });

      // Send email when the status is updated
      if (newStatus === "1") {
        sendUnBannedEmail(adminEmail);
      } else if (newStatus === "2") {
        sendBannedEmail(adminEmail);
      }

      Swal("Success!", "Admin status updated successfully.", "success");
      fetchAdmins(); // Refresh the admin list
    } catch (error) {
      let errorMessage = "An error occurred while updating the admin status.";
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
        title: "Error updating admin status!",
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
      <h2>Admin List</h2>
      <Link
        to="/admin/createAdmin"
        className="btn btn-success mb-3"
        style={{ marginLeft: "auto" }}
      >
        Add New Admin
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
              <td colSpan={columns.length} className="text-center">
                No matching records found
              </td>
            </tr>
          ) : (
            currentItems.map((admin, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, colIndex) => {
                  // If the column is 'Status', provide a dropdown to change status
                  if (column === "Status") {
                    return (
                      <td key={colIndex} className="data-cell">
                        <select
                          className="form-select"
                          value={admin.Status.toString()}
                          onChange={(e) =>
                            updateAdminStatus(admin.ID, e.target.value)
                          }
                          disabled={admin.Role !== "Admin"}
                        >
                          <option value="1">Verified</option>
                          <option value="2">Banned</option>
                        </select>
                      </td>
                    );
                  } else if (column === "Action") {
                    // Provide action buttons based on role
                    return (
                      <td key={colIndex} className="data-cell">
                        {admin.Role === "Admin" && (
                          <Link
                            to={`/admin/editAdmin/${admin.ID}`}
                            className="btn btn-primary btn-lg block"
                          >
                            <i className="bi bi-pencil"></i>
                          </Link>
                        )}
                        {admin.Role === "Super Admin" && (
                          <button
                            onClick={handleBlockClick}
                            className="btn btn-danger btn-lg block"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                        )}
                      </td>
                    );
                  } else {
                    // For all other columns, just display the value
                    return (
                      <td key={colIndex} className="data-cell">
                        {admin[column]}
                      </td>
                    );
                  }
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {admins.length > 0 && (
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

export default AdminPage;
