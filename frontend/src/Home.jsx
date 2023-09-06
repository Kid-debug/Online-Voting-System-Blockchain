import React, { useState } from "react";
import { Row, Col, Button, Dropdown, DropdownButton } from "react-bootstrap"; // Import Dropdown and DropdownButton
import { FaBriefcase, FaUsers, FaUser, FaCheck } from "react-icons/fa"; // Import icons
import "./style.css";
import { useNavigate } from "react-router-dom";
import ApexChart from "./VoteTally"; // Import the ApexChart component

function Home() {
  const [selectedMainCategory, setSelectedMainCategory] = useState("SRC"); // Initial selected main category
  const [selectedSubCategory, setSelectedSubCategory] = useState("President"); // Initial selected sub category

  // Define mock data (replace with your actual data fetching)
  const data = [
    {
      label: "No. of Categories",
      value: 5,
      color: "dark-blue",
      icon: <FaBriefcase size={30} />,
    },
    {
      label: "No. of Candidates",
      value: 10,
      color: "red",
      icon: <FaUsers size={35} />,
    },
    {
      label: "Total Voters",
      value: 100,
      color: "green",
      icon: <FaUser size={30} />,
    },
    {
      label: "Voters Voted",
      value: 50,
      color: "purple",
      icon: <FaCheck size={35} />,
    },
  ];

  // Define subcategories
  const subcategories = [
    "President",
    "Vice President",
    "Secretary",
    "Treasurer",
    "Committee Member",
  ];

  // Function to render the circle tiles
  const renderCircleTiles = () => {
    return data.map((item, index) => (
      <Col lg={3} xs={6} key={index}>
        <div className={`circle-tile ${item.color}`}>
          <a href="#">
            <div className="circle-tile-heading">{item.icon}</div>
          </a>
          <div className="circle-tile-content">
            <div className="circle-tile-description text-faded">
              {item.label}
            </div>
            <div className="circle-tile-number text-faded ">{item.value}</div>
            <a className="circle-tile-footer" href="#">
              More Info <i className="fa fa-chevron-circle-right"></i>
            </a>
          </div>
        </div>
      </Col>
    ));
  };

  // Function to handle main category selection
  const handleMainCategorySelect = (mainCategory) => {
    setSelectedMainCategory(mainCategory);
    // Set the default subcategory when the main category changes
    setSelectedSubCategory(subcategories[0]);
  };

  // Function to handle subcategory selection
  const handleSubCategorySelect = (subCategory) => {
    setSelectedSubCategory(subCategory);
  };

  return (
    <div className="content-wrapper">
      <section className="content-header mb-5">
        <h1>Dashboard</h1>
      </section>

      <section className="content">
        {/* Small boxes (Stat box) */}
        <Row>{renderCircleTiles()}</Row>

        {/* Votes Tally Bar Chart */}
        <Row>
          <Col xs={12}>
            <div className="mt-3">
              <h3>Votes Tally</h3>
              <div className="bordered-div">
                <h3>
                  {selectedMainCategory} - {selectedSubCategory}
                </h3>
                <div className="d-flex justify-content">
                  <DropdownButton
                    id="main-category-dropdown"
                    title="Select Main Category"
                    onSelect={handleMainCategorySelect}
                  >
                    <Dropdown.Item eventKey="SRC">SRC</Dropdown.Item>
                    <Dropdown.Item eventKey="Faculty">
                      Faculty of Applied Sciences
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="Faculty">
                      Faculty of Computing & Information Technology
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="Faculty">
                      Faculty of Accountancy, Finance & Business
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="Faculty">
                      Faculty of Engineering & Technology
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="Faculty">
                      Faculty of Built Environment
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="Faculty">
                      Faculty of Communication & Creative Industries
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="Faculty">
                      Faculty of Social Science & Humanities
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="Faculty">
                      Centre for Pre-University Studies
                    </Dropdown.Item>
                    {/* Add more main categories here */}
                  </DropdownButton>
                  <DropdownButton
                    id="sub-category-dropdown"
                    title="Select Sub Category"
                    onSelect={handleSubCategorySelect}
                  >
                    {subcategories.map((subcategory) => (
                      <Dropdown.Item key={subcategory} eventKey={subcategory}>
                        {subcategory}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                </div>
                {/* Wrap the chart in a div */}
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
