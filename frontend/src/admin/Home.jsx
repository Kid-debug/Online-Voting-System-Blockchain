import React, { useState, useEffect } from "react";
import { Row, Col, Button, Dropdown, DropdownButton } from "react-bootstrap"; // Import Dropdown and DropdownButton
import { FaBriefcase, FaUsers, FaUser, FaVoteYea } from "react-icons/fa"; // Import icons
import "../stylesheets/home.css";
import { Link } from "react-router-dom";
import ApexChart from "./VoteTally";
import Web3 from "web3";
import votingContract from "../../../build/contracts/VotingSystem.json";
import { contractAddress } from "../../../config";

function Home() {
  const [categoryCount, setCategoryCount] = useState(0);
  const [candidateCount, setCandidateCount] = useState(0);
  const [voterCount, setVoterCount] = useState(0);
  const [positionCount, setPositionCount] = useState(0);

  // Function to fetch category count from the smart contract
  const fetchCategoryCount = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(
        votingContract.abi,
        contractAddress
      );
      const categoryList = await contract.methods.getAllCategory().call();
      const result = categoryList.filter(
        (category) => Number(category.categoryId) !== 0
      );
      const newCategoryCount = result.length;
      setCategoryCount(Number(newCategoryCount));
    } catch (error) {
      console.error("Error fetching category count:", error);
    }
  };

  // useEffect to fetch category count when the component mounts
  useEffect(() => {
    fetchCategoryCount();
  }, []);

  const fetchCandidateCount = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(
        votingContract.abi,
        contractAddress
      );
      const candidatesList = await contract.methods.getAllCandidates().call();
      const result = candidatesList.filter(
        (candidate) => Number(candidate.id) !== 0
      );
      const newCandidateCount = result.length;
      setCandidateCount(Number(newCandidateCount));
    } catch (error) {
      console.error("Error fetching candidate count:", error);
    }
  };

  // useEffect to fetch candidate count when the component mounts
  useEffect(() => {
    fetchCandidateCount();
  }, []);

  const fetchVoterCount = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(
        votingContract.abi,
        contractAddress
      );
      const allVoters = await contract.methods.getAllVoter().call();
      const usersWithRoleU = allVoters.filter(
        (voter) => voter.role === "U" && Number(voter.id) !== 0
      );
      const newVoterCount = usersWithRoleU.length;
      setVoterCount(Number(newVoterCount));
    } catch (error) {
      console.error("Error fetching voter count:", error);
    }
  };

  // useEffect to fetch voter count when the component mounts
  useEffect(() => {
    fetchVoterCount();
  }, []);

  const fetchPositionCount = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(
        votingContract.abi,
        contractAddress
      );
      const eventList = await contract.methods.getAllEvent().call();
      const result = eventList.filter((event) => Number(event.eventId) !== 0);

      const newPositionCount = result.length;
      setPositionCount(Number(newPositionCount));
    } catch (error) {
      console.error("Error fetching position count:", error);
    }
  };

  // useEffect to fetch position count when the component mounts
  useEffect(() => {
    fetchPositionCount();
  }, []);

  // Define mock data (replace with your actual data fetching)
  const data = [
    {
      label: "No. of Categories",
      value: categoryCount,
      icon: <FaBriefcase size={30} />,
      route: "/admin/category",
    },
    {
      label: "No. of Candidates",
      value: candidateCount,
      icon: <FaUsers size={35} />,
      route: "/admin/candidate",
    },
    {
      label: "No. of Voters",
      value: voterCount,
      icon: <FaUser size={30} />,
      route: "/admin/voter",
    },
    {
      label: "No. of Position",
      value: positionCount,
      icon: <FaVoteYea size={35} />,
      route: "/admin/position",
    },
  ];

  // Function to render the circle tiles
  const renderCircleTiles = () => {
    return data.map((item, index) => (
      <Col lg={3} xs={6} key={index}>
        <div className="circle-tile">
          <a href="#">
            <div className="circle-tile-heading">{item.icon}</div>
          </a>
          <div className="circle-tile-content">
            <div className="circle-tile-description text-faded">
              {item.label}
            </div>
            <div className="circle-tile-number text-faded ">{item.value}</div>
            <Link to={item.route} className="circle-tile-footer">
              More Info <i className="fa fa-chevron-circle-right"></i>
            </Link>
          </div>
        </div>
      </Col>
    ));
  };

  // Function to handle subcategory selection
  const handleCategorySelect = (Category) => {
    setSelectedCategory(Category);
  };

  const handleElectionSelect = (election) => {
    setSelectedElection(election);
  };

  return (
    <div className="content-wrapper">
      <section className="content-header mb-5">
        <h1>Dashboard</h1>
        {/* <h1>
          (
          <span
            style={{
              textTransform: "lowercase",
              fontWeight: "normal",
              fontSize: "20px",
            }}
          >
            {email}
          </span>
          )
        </h1> */}
      </section>

      <section className="content">
        {/* Small boxes (Stat box) */}
        <Row>{renderCircleTiles()}</Row>

        {/* Votes Tally Bar Chart */}
        <Row>
          <Col xs={12}>
            <div className="mt-3">
              {/* Category Dropdown */}
              <h3>Votes Tally</h3>
              <div className="bordered-div">
                <div className="d-flex justify-content"></div>
                <ApexChart />
              </div>
            </div>
          </Col>
        </Row>
      </section>
    </div>
  );
}

export default Home;
