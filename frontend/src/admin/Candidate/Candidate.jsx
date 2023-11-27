import React from "react";
import "../../stylesheets/list.css";
import { useState } from "react";
import { Link } from "react-router-dom";

function Candidate() {
  const data = [
    {
      ID: "1",
      Name: "Chin Khai Ray",
      Image: "public/img1.jpg",
      "Student ID": "2205700",
      Description:
        "Chin Khai Ray is a dedicated student with a strong commitment to improving student life on campus. As a candidate for the President of the Student Council, he aims to bring positive changes and enhance student engagement.",
      Position: "President",
      Election: "2023 FOCS Election",
      Action: "Edit",
    },
    {
      ID: "2",
      Name: "Chin Zi Xin",
      Image: "public/img2.jpg",
      "Student ID": "2205701",
      Description:
        "Chin Zi Xin is an enthusiastic student leader who believes in creating a more inclusive and vibrant campus community. She is running for the position of President to advocate for student rights and interests.",
      Position: "President",
      Election: "2023 FOCS Election",
      Action: "Edit",
    },
    {
      ID: "3",
      Name: "Lim Er Hao",
      Image: "public/img3.jpg",
      "Student ID": "2205702",
      Description:
        "Lim Er Hao is a dedicated advocate for student welfare and academic excellence. As a candidate for President, he aims to promote transparency and accountability within the Student Council.",
      Position: "President",
      Election: "2023 FOCS Election",
      Action: "Edit",
    },
    {
      ID: "4",
      Name: "Tee Fo Yo",
      Image: "public/img4.jpg",
      "Student ID": "2205703",
      Description:
        "Tee Fo Yo is a passionate student leader who believes in the power of collaboration and unity among students. Running for President, he aims to foster a sense of community and teamwork.",
      Position: "President",
      Election: "2023 FOCS Election",
      Action: "Edit",
    },
    {
      ID: "5",
      Name: "Lee Sze Yen",
      Image: "public/img5.jpg",
      "Student ID": "2205704",
      Description:
        "Lee Sze Yen is a visionary student leader with a strong commitment to bringing innovative changes to the campus. She is a candidate for President, focusing on enhancing student experiences and opportunities.",
      Position: "President",
      Election: "2023 FOCS Election",
      Action: "Edit",
    },
    {
      ID: "6",
      Name: "Tan Wei Jie",
      Image: "public/img6.jpg",
      "Student ID": "2205705",
      Description:
        "Tan Wei Jie is a driven and dedicated student leader who is passionate about creating a more sustainable and eco-friendly campus. Running for President, he aims to implement green initiatives and eco-conscious policies.",
      Position: "President",
      Election: "2023 FOCS Election",
      Action: "Edit",
    },
    {
      ID: "7",
      Name: "Wong Mei Ling",
      Image: "public/img7.jpg",
      "Student ID": "2205706",
      Description:
        "Wong Mei Ling is a dynamic and approachable candidate who believes in fostering strong student-faculty relationships. As a President candidate, she aims to bridge the gap between students and faculty members.",
      Position: "President",
      Election: "2023 FOCS Election",
      Action: "Edit",
    },
    {
      ID: "8",
      Name: "Lim Eng Chuan",
      Image: "public/img8.jpg",
      "Student ID": "2205707",
      Description:
        "Lim Eng Chuan is a visionary candidate who envisions a more innovative and tech-savvy campus. Running for President, he plans to introduce digital solutions to enhance campus life.",
      Position: "President",
      Election: "2023 FOCS Election",
      Action: "Edit",
    },
    {
      ID: "9",
      Name: "Chong Mei Yen",
      Image: "public/img9.jpg",
      "Student ID": "2205708",
      Description:
        "Chong Mei Yen is a compassionate and empathetic candidate who advocates for mental health and well-being. She is running for President to create a more supportive and mentally healthy campus environment.",
      Position: "President",
      Election: "2023 FOCS Election",
      Action: "Edit",
    },
    {
      ID: "10",
      Name: "Ng Wei Lun",
      Image: "public/img10.jpg",
      "Student ID": "2205709",
      Description:
        "Ng Wei Lun is an energetic and innovative candidate who aims to promote extracurricular activities and student engagement. Running for President, he plans to enhance student life outside the classroom.",
      Position: "President",
      Election: "2023 FOCS Election",
      Action: "Edit",
    },
  ];

  const columns = [
    "ID",
    "Name",
    "Image",
    "Student ID",
    "Description",
    "Position",
    "Election",
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
