import React, { useState, useEffect } from "react";
import { Row, Col, Button, Dropdown, DropdownButton } from "react-bootstrap"; // Import Dropdown and DropdownButton
import { FaBriefcase, FaUsers, FaUser, FaVoteYea } from "react-icons/fa"; // Import icons
import "../stylesheets/home.css";
import { Link, useNavigate } from "react-router-dom";
import ApexChart from "./VoteTally"; // Import the ApexChart component
import axios from "axios";

function Home() {
  // State initialization
  const [selectedCategory, setSelectedCategory] = useState(
    "Computer Science Society"
  );
  const [selectedElection, setSelectedElection] =
    useState("2023 FOCS Election");
  const [selectedPosition, setSelectedPosition] = useState("President");

  // Define mock data (replace with your actual data fetching)
  const data = [
    {
      label: "No. of Categories",
      value: 5,
      icon: <FaBriefcase size={30} />,
      route: "/position",
    },
    {
      label: "No. of Candidates",
      value: 10,
      icon: <FaUsers size={35} />,
      route: "/candidate",
    },
    {
      label: "Total Voters",
      value: 5,
      icon: <FaUser size={30} />,
      route: "/voter",
    },
    {
      label: "Active Elections",
      value: 1,
      icon: <FaVoteYea size={35} />,
      route: "/election",
    },
  ];

  const categories = [
    "President",
    "Vice President",
    "Secretary",
    "Treasurer",
    "Committee Member",
  ];

  const elections = [
    "2023 SRC Election",
    "2023 FOCS Election",
    "2023 FAFB Election",
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

  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/get-user")
      .then((res) => {
        if (res.data.valid) {
          setEmail(res.data.email);
        } else {
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="content-wrapper">
      <section className="content-header mb-5">
        <h1>Dashboard</h1>
        <h1>
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
        </h1>
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
                <div>
                  <label>Select Category: </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">--Select Category--</option>
                    {/* Example categories - you can populate these based on your actual data */}
                    <option value="category1">Category 1</option>
                    <option value="category2">Category 2</option>
                    <option value="category3">Category 3</option>
                  </select>
                </div>

                {/* Election Dropdown */}
                <div>
                  <label>Select Election: </label>
                  <select
                    value={selectedElection}
                    onChange={(e) => setSelectedElection(e.target.value)}
                  >
                    <option value="">--Select Election--</option>
                    {/* Example elections - you can populate these based on your actual data */}
                    <option value="election1">Election 1</option>
                    <option value="election2">Election 2</option>
                    <option value="election3">Election 3</option>
                  </select>
                </div>

                {/* Position Dropdown */}
                <div>
                  <label>Select Position: </label>
                  <select
                    value={selectedPosition}
                    onChange={(e) => setSelectedPosition(e.target.value)}
                  >
                    <option value="">--Select Position--</option>
                    {/* Example positions - you can populate these based on your actual data */}
                    <option value="position1">Position 1</option>
                    <option value="position2">Position 2</option>
                    <option value="position3">Position 3</option>
                  </select>
                </div>
                <h3>
                  {selectedCategory} - {selectedElection} - {selectedPosition}
                </h3>
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
