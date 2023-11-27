import React from "react";
import Header from "./container/Header";
import Footer from "./container/Footer";
import { Link } from "react-router-dom";
import "./stylesheets/electionlist.css";

const data = [
  {
    ID: "1",
    "Election Name": "2023 Student Council Election",
    Category: "Computer Science Society",
    "Start Date": "2023-09-26",
    "End Date": "2023-10-03",
  },
  {
    ID: "2",
    "Election Name": "2023 Programming Club Elections",
    Category: "Computer Science Society",
    "Start Date": "2023-10-01",
    "End Date": "2023-10-08",
  },
  {
    ID: "3",
    "Election Name": "2023 Robotics Society Election",
    Category: "Computer Science Society",
    "Start Date": "2023-07-15",
    "End Date": "2023-07-22",
  },
  {
    ID: "4",
    "Election Name": "2023 Data Science Association Elections",
    Category: "Computer Science Society",
    "Start Date": "2023-08-05",
    "End Date": "2023-08-12",
  },
  {
    ID: "5",
    "Election Name": "2023 AI Research Group Election",
    Category: "Computer Science Society",
    "Start Date": "2023-11-01",
    "End Date": "2023-11-08",
  },
  {
    ID: "6",
    "Election Name": "2023 Cybersecurity Club Elections",
    Category: "Computer Science Society",
    "Start Date": "2023-06-20",
    "End Date": "2023-06-27",
  },
  {
    ID: "7",
    "Election Name": "2023 Web Development Society Election",
    Category: "Computer Science Society",
    "Start Date": "2023-12-03",
    "End Date": "2023-12-10",
  },
  {
    ID: "8",
    "Election Name": "2023 Game Development Association Elections",
    Category: "Computer Science Society",
    "Start Date": "2023-09-30",
    "End Date": "2023-10-07",
  },
];

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

function ElectionList() {
  return (
    <div>
      <Header />
      <div className="election-list-title">Election List</div>
      <div className="header_fixed">
        <table className="election-table mb-5">
          <thead>
            <tr>
              <th>Election No.</th>
              <th>Election Name</th>
              <th>Category</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((election, index) => (
              <tr key={election.ID} onClick={() => selectElection(election)}>
                <td>{election.ID}</td>
                <td>{election["Election Name"]}</td>
                <td>{election.Category}</td>
                <td>{election["Start Date"]}</td>
                <td>{election["End Date"]}</td>
                <td>{getElectionStatus(election)}</td>
                <td>
                  <Link
                    to="/electionDetails"
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
      </div>
      <Link
        to="/electionDetails"
        className="action text-center text-decoration-none"
      ></Link>
      <Footer />
    </div>
  );
}

export default ElectionList;
