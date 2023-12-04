import React from "react";
import "../../stylesheets/list.css";
import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import votingContract from "../../../../build/contracts/VotingSystem.json";
import Web3 from "web3";
import { contractAddress } from "../../config";

function Candidate() {
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();

        const contract = new web3.eth.Contract(
          votingContract.abi,
          contractAddress
        );

        // Call the getAllEvent function in smart contract
        const candidatesList = await contract.methods.getAllCandidates().call();
        console.log('candidateList : ', candidatesList);

        const candidatePromises = candidatesList.map(async (candidate) => {
          const category = await contract.methods.getCategoryById(candidate.categoryId).call();
          const event = await contract.methods.getEventById(candidate.categoryId, candidate.eventId).call();
          return {
            candidateId: Number(candidate.id),
            candidateName: candidate.name,
            candidateDesc: candidate.description,
            candidateVoteCount : Number(candidate.voteCount),
            categoryName: category.categoryName,
            eventName: event.eventName,
          };
        });


        const formattedEvents = await Promise.all(candidatePromises);
        console.log("Event", formattedEvents);
        setCandidates(formattedEvents);
      } catch (error) {
        console.error("Error fetching Event:", error);
      }
    };

    fetchCategories();
  }, []); // The empty dependency array ensures that this effect runs once, similar to componentDidMount

   // Define a mapping between API keys and display names
   const columnMapping = {
    candidateId:  "ID",
    categoryName: "Category Name",
    eventName: "Event Name",
    candidateName: "Candidate Name",
    candidateDesc: "Description",
    candidateVoteCount : "Vote Count",
    Action: "Action",
  };

  const columns = [
    "candidateId",
    "categoryName",
    "eventName",
    "candidateName",
    "candidateDesc",
    "candidateVoteCount",
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
          {currentItems.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="data-cell">
                  {column === "Image" ? (
                    <img src={row[column]} alt="Image" className="image" />
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
                        to={`/admin/editCandidate`}
                        className="btn btn-primary btn-sm"
                      >
                        <i className="fs-4 bi-pencil"></i>
                      </Link>
                      <button className="btn btn-danger btn-sm">
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
            onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
            className="items-per-page-select" // Added className to select element
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </label>
      </div>
    </div>
  );
}

export default Candidate;
