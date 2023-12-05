import React from "react";
import Header from "./container/Header";
import Footer from "./container/Footer";
import { Link } from "react-router-dom";
import "./stylesheets/electionlist.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import votingContract from "../../build/contracts/VotingSystem.json";
import Web3 from "web3";
import { contractAddress } from "./config";

function ElectionList() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const { categoryId } = useParams();
  console.log("categoryId : ", categoryId);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();

        const contract = new web3.eth.Contract(
          votingContract.abi,
          contractAddress
        );

        // Call the getAllEvent function in smart contract
        const eventList = await contract.methods
          .getAllCategoryEvent(categoryId)
          .call();

        const eventPromises = eventList.map(async (event) => {
          const categoryName = await contract.methods
            .getCategoryById(event.categoryId)
            .call();
          return {
            eventId: Number(event.eventId),
            eventName: event.eventName,
            categoryName: categoryName.categoryName,
          };
        });

        const formattedEvents = await Promise.all(eventPromises);
        console.log("Event", formattedEvents);
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching Event:", error);
      }
    };

    fetchCategories();
  }, []); // The empty dependency array ensures that this effect runs once, similar to componentDidMount

  const selectElection = (election) => {
    // Logic to select election and determine the next steps
    console.log("Selected Election:", election);
  };

  const getElectionStatus = (election) => {
    const currentDate = new Date();
    const startDate = new Date(election["Start Date"]);
    const endDate = new Date(election["End Date"]);

    if (currentDate >= startDate && currentDate <= endDate) {
      return "In Progess";
    } else if (currentDate < startDate) {
      return "Upcoming";
    } else {
      return "Completed";
    }
  };

  const getElectionAction = (election) => {
    if (getElectionStatus(election) === "Ongoing" && !has_voted) {
      return <button onClick={() => vote(election)}>Vote</button>;
    } else {
      return "View Details";
    }
  };

  const vote = (election) => {
    // Placeholder logic for voting (can be integrated with actual backend logic later)
    has_voted = true;
    console.log("Voted for:", election["Election Name"]);
  };

  const filterData = (data) => {
    const searchTermLower = searchTerm.toLowerCase();
    return data.filter((event) =>
      Object.values(event).join(" ").toLowerCase().includes(searchTermLower)
    );
  };

  const sortedAndFilteredData = filterData(events); // Add sorting if necessary
  const totalPages = Math.ceil(sortedAndFilteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedAndFilteredData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  return (
    <div>
      <Header />
      <div className="election-container">
        <h2 className="mt-5 mb-4">Election List</h2>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
          </div>
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <table className="data-table election-table mt-4">
          <thead>
            <tr>
              <th>Event No.</th>
              <th>Event Name</th>
              <th>Category</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((election) => (
              <tr key={election.eventId}>
                <td>{election.eventId}</td>
                <td>{election.eventName}</td>
                <td>{election.categoryName}</td>
                <td>{election["Start Date"]}</td>
                <td>{election["End Date"]}</td>
                <td>{getElectionStatus(election)}</td>
                <td>
                  <Link
                    to={`/voting/${categoryId}/${election.eventId}`}
                    style={{
                      border: "none",
                      padding: "7px 20px",
                      borderRadius: "20px",
                      backgroundColor: "black",
                      color: "#e6e7e8",
                      textDecoration: "none", // Remove the default underline
                      display: "inline-block", // Make the link a block element
                    }}
                  >
                    View Details
                  </Link>
                </td>
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
          {[...Array(totalPages).keys()].map((page) => (
            <button
              key={page + 1}
              onClick={() => handlePageChange(page + 1)}
              style={{
                fontWeight: currentPage === page + 1 ? "bold" : "normal",
              }}
              className={`page-button`}
            >
              {page + 1}
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
      </div>
      <Footer />
    </div>
  );
}

export default ElectionList;
