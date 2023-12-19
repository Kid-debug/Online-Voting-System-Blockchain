import React from "react";
import "../../stylesheets/list.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import votingContract from "../../../../build/contracts/VotingSystem.json";
import Web3 from "web3";
import { contractAddress } from "../../../../config";
import Swal from "sweetalert";

function Position() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [currentDateTime, setCurrentDatetTime] = useState();

  useEffect(() => {
    function getCurrentDateTimeInMalaysia() {
      // Get the current date and time in UTC
      const now = new Date();
      // Convert it to Malaysia time (UTC+8)
      const malaysiaTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
      // Format the date and time to be suitable for the datetime-local input
      const formattedDateTime = malaysiaTime.toISOString().slice(0, 16);
      return formattedDateTime;
    }
    // Function to run every second
    const everySecondFunction = async () => {
      const currentTime = getCurrentDateTimeInMalaysia();
      const unixCurrentTime = new Date(currentTime).getTime() / 1000;
      setCurrentDatetTime(unixCurrentTime);
    };

    // Set up an interval to run every second
    const intervalId = setInterval(everySecondFunction, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to ensure it runs only once when the component mounts

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      await window.ethereum.enable();

      const contract = new web3.eth.Contract(
        votingContract.abi,
        contractAddress
      );

      // Call the getAllEvent function in smart contract
      const eventList = await contract.methods.getAllEvent().call();
      const filteredEvents = eventList.filter(
        (event) => Number(event.eventId) !== 0
      );

      const eventPromises = filteredEvents.map(async (event) => {
        const categoryName = await contract.methods
          .getCategoryById(event.categoryId)
          .call();
        return {
          eventId: Number(event.eventId),
          eventName: event.eventName,
          eventDesc: event.eventDesc,
          categoryId: event.categoryId,
          categoryName: categoryName.categoryName,
          candidatesCount: Number(event.candidateCount),
          eventStatus: Number(event.status),
          eventStartDate: Number(event.startDateTime),
          eventEndDate: Number(event.endDateTime),
        };
      });

      // Await all the promises and then filter the results
      const formattedEvents = await Promise.all(eventPromises);

      setEvents(formattedEvents);
      console.log(formattedEvents);
    } catch (error) {
      console.error("Error fetching Event:", error);
    }
  };

  // Define a mapping between API keys and display names
  const columnMapping = {
    eventId: "ID",
    eventName: "Event Name",
    eventDesc: "Event Description",
    categoryName: "Category Name",
    candidatesCount: "Candidates",
    eventStatus: "Status",
    eventStartDate: "Start Date",
    eventEndDate: "End Date",
    Action: "Action",
  };

  // Create an array of display names based on the API keys
  const columns = [
    "eventId",
    "eventName",
    "eventDesc",
    "categoryName",
    "candidatesCount",
    "eventStatus",
    "eventStartDate",
    "eventEndDate",
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

  const getElectionStatus = (election) => {
    // 1: Upcoming, 2: In Progress, 3: Completed, 4： Cancel
    const status = election.eventStatus;
    console.log("status : ", status);
    if (status == 1) {
      return "Upcoming";
    } else if (status == 2) {
      return "Processing";
    } else if (status == 3) {
      return "Marking Winner";
    } else {
      return "Complete";
    }
  };

  // search function
  // Helper function to filter the data based on the search term
  const filterData = (events) => {
    return events.filter((item) =>
      Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  // Sort the filtered data
  const sortedData = sortColumn
    ? filterData(events).sort((a, b) => {
        if (sortColumn === "eventId") {
          // Parse the values as numbers for numeric comparison
          const aValue = parseInt(a[sortColumn]);
          const bValue = parseInt(b[sortColumn]);

          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        } else if (sortColumn !== "Action") {
          // For non-numeric columns, use localeCompare for string comparison
          const aValue = a[sortColumn].toString();
          const bValue = b[sortColumn].toString();

          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else {
          // For "Action" column, maintain the order
          return 0;
        }
      })
    : filterData(events);

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
  const handleDeleteEvent = (categoryId, eventId) => {
    setEventToDelete({ categoryId, eventId });
    setShowDeleteConfirmation(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setEventToDelete(null);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;

    const { categoryId, eventId } = eventToDelete;
    setShowDeleteConfirmation(false);

    try {
      console.log(
        `Attempting to delete position with ID ${eventId} from category with ID ${categoryId}`
      );
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const accounts = await web3.eth.getAccounts();

      const contract = new web3.eth.Contract(
        votingContract.abi,
        contractAddress
      );

      // Call the deleteEvent function in your smart contract
      await contract.methods.deleteEvent(categoryId, eventId).send({
        from: accounts[0],
      });

      console.log(
        `Position with ID ${eventId} deleted successfully from category with ID ${categoryId}`
      );

      // Fetch updated events after deletion
      fetchEvents();

      // Prompt success message
      Swal("Success!", "You've successfully deleted the position.", "success");
    } catch (error) {
      let errorMessage = "An error occurred while deleting the position.";
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
        title: "Error Deleting Position!",
        text: errorMessage,
      });

      // Reset the eventToDelete state
      setEventToDelete(null);
    }
  };

  const getConfirmationContent = () => {
    return {
      title: "Delete Position Confirmation",
      content: "Are you sure you want to delete this position?",
    };
  };

  const formatUnixTimestamp = (timestamp) => {
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: "Asia/Kuala_Lumpur", // Set the desired time zone
    }).format(timestamp * 1000); // Convert timestamp to milliseconds

    return formattedDate;
  };

  return (
    <div className="container mt-5">
      <h2>Event List</h2>
      <Link
        to="/admin/createPosition"
        className="btn btn-success mb-3"
        style={{ marginLeft: "auto" }}
      >
        Add New Event
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
                    {column === "eventDesc" ? (
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
                            <span
                              style={{
                                wordBreak: "break-all",
                              }}
                            >
                              {row[column]}
                            </span>
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
                          to={`/admin/editPosition/${row.categoryId}/${row.eventId}`}
                          className="btn btn-primary btn-sm"
                        >
                          <i className="fs-4 bi-pencil"></i>
                        </Link>
                        <button
                          onClick={() =>
                            handleDeleteEvent(row.categoryId, row.eventId)
                          }
                          className="btn btn-danger btn-sm"
                        >
                          <i className="fs-4 bi-trash"></i>
                        </button>
                      </>
                    ) : column === "eventStatus" ? (
                      getElectionStatus(row)
                    ) : column === "eventStartDate" ? (
                      formatUnixTimestamp(row.eventStartDate)
                    ) : column === "eventEndDate" ? (
                      formatUnixTimestamp(row.eventEndDate)
                    ) : (
                      row[column]
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
      {events.length > 0 && (
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

export default Position;
