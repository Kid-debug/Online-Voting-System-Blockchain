import React, { useState, useEffect } from "react";
import Header from "./container/Header";
import Footer from "./container/Footer";
import { Link } from "react-router-dom";
import "./stylesheets/voterhome.css";
import votingContract from "../../build/contracts/VotingSystem.json";
import Web3 from "web3";
import { contractAddress } from "../../config";

function VoterDashboard() {
  // State for sorting and filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [cardData, setCardData] = useState([]);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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

        // Call the getAllCategory function in your smart contract
        const categoryList = await contract.methods.getAllCategory().call();
        const formattedCategories = categoryList
          .filter((category) => Number(category.categoryId) !== 0)
          .map((category) => ({
            categoryId: Number(category.categoryId),
            categoryName: category.categoryName,
          }));

        console.log("category", categoryList);
        setCardData(formattedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []); // The empty dependency array ensures that this effect runs once, similar to componentDidMount

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  // Handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Sort by name function
  const sortByName = () => {
    setSortDirection((prevSortDirection) =>
      prevSortDirection === "asc" ? "desc" : "asc"
    );
    setCardData((prevCardData) => {
      const sortedData = [...prevCardData].sort((a, b) =>
        sortDirection === "asc"
          ? b.categoryName.localeCompare(a.categoryName)
          : a.categoryName.localeCompare(b.categoryName)
      );
      return sortedData;
    });
  };

  // Get filtered and sorted data
  const filteredData = cardData.filter((card) =>
    card.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Change page function
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <Header />
      <h2 className="mt-4">VOTER PORTAL</h2>
      <div className="container">
        <div id="categorybox" className="mt-4">
          <input
            className="search"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className="sort" onClick={sortByName}>
            Sort by Category Name
          </button>
          <label htmlFor="itemsPerPage">Items per page:</label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
          >
            {[5, 10, 15, 20].map((number) => (
              <option key={number} value={number}>
                {number}
              </option>
            ))}
          </select>
          <div className="list">
            {currentItems.length === 0 ? (
              <h4 className="text-center">No matching records found</h4>
            ) : (
              currentItems.map((card, index) => (
                <Link
                  to={`/electionList/${Number(card.categoryId, 10)}`}
                  key={card.categoryId}
                  className="project-name"
                >
                  <h3>{card.categoryName}</h3>
                  <i className="fas bi-eye"></i>
                </Link>
              ))
            )}
          </div>
        </div>
        <nav>
          <ul className="pagination">
            {Array.from(
              { length: Math.ceil(filteredData.length / itemsPerPage) },
              (_, index) => (
                <li
                  key={index}
                  className={currentPage === index + 1 ? "active" : ""}
                >
                  <a onClick={() => paginate(index + 1)} href="#!">
                    {index + 1}
                  </a>
                </li>
              )
            )}
          </ul>
        </nav>
      </div>

      <div className="container container_instruction mb-4">
        <h3 id="round-corner">Voting Guidelines</h3>
        <p>
          Welcome to the online Voting Portal. This system is designed to
          provide a secure and transparent method for conducting elections. In
          this manual, we will explain how to use the system as a user.
          <h5>1. Accessing Your Account</h5>
          To begin the voting process, log in to your account using your
          registered user ID or email and your password. Ensure you have
          completed the registration process as described in the previous
          section.
          <h5>2. Selecting an Category</h5>
          From your dashboard, you will see a list of categories. Click on the
          category you wish to participate in to access the election list.
          <h5>3. Selecting an Election</h5>
          From your election list page, you will see a list of elections. Click
          on the election you wish to participate in to access more election
          details.
          <h5>3. Viewing the election details</h5>
          From your election details page, you will see a the details such as
          date and time. Click on the vote button if you want to continue the
          voting process.
          <h5>4. Reviewing Candidates</h5>
          Before casting your vote, take the time to review the candidates
          running in the election. You can typically find candidate profiles and
          their platforms to make an informed choice.
          <h5>5. Casting Your Vote</h5>
          When you are ready to vote, select your preferred candidate by
          clicking on their name or designated area. Review your choice
          carefully, as your vote cannot be changed once submitted.
          <h5>6. Confirming Your Vote</h5>
          After making your selection, you will be prompted to confirm your
          vote. Double-check that your chosen candidate is correct, and confirm
          your vote to complete the process.
          <h5>7. Verify Your Vote</h5>
          After confirming your vote, you will be prompted to enter your
          verification code that we sent to your email to verify you vote.
          <h5>8. Completed Your Vote</h5>
          When you enter the correct verification code, your vote will be
          counted and cannot make changes anymore. You can view the election
          result after your voting.
        </p>
      </div>

      <Footer />
    </div>
  );
}

export default VoterDashboard;
