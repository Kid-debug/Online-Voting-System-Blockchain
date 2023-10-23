import React from "react";
import "../../list.css";
import { useState } from "react";
import { Link } from "react-router-dom";

function AdminFeedback() {
  const data = [
    {
      ID: "1",
      "User Name": "Ng Hooi Seng",
      "Content Description": "The voting process was smooth and easy to use.",
      Date: "2023-09-28",
      Action: "Edit",
    },
    {
      ID: "2",
      "User Name": "Woon Zhong Liang",
      "Content Description": "I had some issues with the registration process.",
      Date: "2023-09-29",
      Action: "Edit",
    },
    {
      ID: "3",
      "User Name": "Kurt Cheong Jun Wei",
      "Content Description": "Great job on the user interface!",
      Date: "2023-09-30",
      Action: "Edit",
    },
    {
      ID: "4",
      "User Name": "Choo Ming Yaw",
      "Content Description": "I found the voting instructions confusing.",
      Date: "2023-10-01",
      Action: "Edit",
    },
    {
      ID: "5",
      "User Name": "Chye Wenn Han",
      "Content Description": "The system was very secure and reliable.",
      Date: "2023-10-02",
      Action: "Edit",
    },
  ];
  
  const columns = [
    "ID",
    "User Name",
    "Content Description",
    "Date",
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

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

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
  const filterData = (data) => {
    return data.filter((item) =>
      Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  // Sort the filtered data
  const sortedData = sortColumn
    ? filterData(data).sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      })
    : filterData(data);

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
                  {column === "Description" ? (
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
                        to={`/editFeedback`}
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

export default AdminFeedback;
