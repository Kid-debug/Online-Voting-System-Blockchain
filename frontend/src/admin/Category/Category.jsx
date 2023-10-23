import React from "react";
import "../../list.css";
import { useState } from "react";
import { Link } from "react-router-dom";

function Category() {
  const data = [
    {
      ID: "1",
      "Category Name": "Chemistry and Biology Society",
      Action: "Edit",
    },
    {
      ID: "2",
      "Category Name": "Food Science Society",
      Action: "Edit",
    },
    {
      ID: "3",
      "Category Name": "Sport and Exercise Science Society",
      Action: "Edit",
    },
    {
      ID: "4",
      "Category Name": "Computer Science Society",
      Action: "Edit",
    },
    {
      ID: "5",
      "Category Name": "Dancing Society",
      Action: "Edit",
    },
    {
      ID: "6",
      "Category Name": "Badminton Club",
      Action: "Edit",
    },
    {
      ID: "7",
      "Category Name": "Basketball Club",
      Action: "Edit",
    },
    {
      ID: "8",
      "Category Name": "Chess Club",
      Action: "Edit",
    },
    {
      ID: "9",
      "Category Name": "Football Club",
      Action: "Edit",
    },
    {
      ID: "10",
      "Category Name": "Kendo Club",
      Action: "Edit",
    },
  ];

  const columns = ["ID", "Category Name", "Action"];

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
      <h2>Category List</h2>
      <Link
        to="/createCategory"
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
                        to={`/editCategory`}
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

export default Category;
