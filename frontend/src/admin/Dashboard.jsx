import React, { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isPositionOpen, setIsPositionOpen] = useState(false);
  const [isCandidatesOpen, setIsCandidatesOpen] = useState(false);
  const [isVotersOpen, setIsVotersOpen] = useState(false);
  const [isElectionOpen, setIsElectionOpen] = useState(false);

  const handleLogout = async () => {
    // Navigate to the login page
    navigate("/");
  };

  const toggleCategory = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };

  const togglePosition = () => {
    setIsPositionOpen(!isPositionOpen);
  };

  const toggleCandidates = () => {
    setIsCandidatesOpen(!isCandidatesOpen);
  };

  const toggleVoters = () => {
    setIsVotersOpen(!isVotersOpen);
  };

  const toggleElection = () => {
    setIsElectionOpen(!isElectionOpen);
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <a
              href="/admin/home"
              className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none"
            >
              <span className="fs-5 fw-bolder d-none d-sm-inline">
                Admin Dashboard
              </span>
            </a>
            <ul
              className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
              id="menu"
            >
              <li>
                <a
                  href="/admin/home"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-speedometer2"></i>{" "}
                  <span className="ms-1 d-none d-sm-inline">Dashboard</span>
                </a>
              </li>
              <li>
                <button
                  onClick={toggleCategory}
                  className="nav-link px-0 align-middle text-white"
                  style={{ background: "none", border: "none" }}
                >
                  <i className="fs-4 bi-columns"></i>{" "}
                  <span className="ms-1 d-none d-sm-inline">
                    Manage Category
                  </span>
                </button>
                {isCategoryOpen && (
                  <ul>
                    <li>
                      <Link
                        to="/admin/category"
                        className="nav-link px-0 align-middle text-white"
                      >
                        Display Category
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/createCategory"
                        className="nav-link px-0 align-middle text-white"
                      >
                        Add New Category
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <button
                  onClick={togglePosition}
                  className="nav-link px-0 align-middle text-white"
                  style={{ background: "none", border: "none" }}
                >
                  <i className="fs-4 bi-person-lines-fill"></i>{" "}
                  <span className="ms-1 d-none d-sm-inline">
                    Manage Position
                  </span>
                </button>
                {isPositionOpen && (
                  <ul>
                    <li>
                      <Link
                        to="/admin/position"
                        className="nav-link px-0 align-middle text-white"
                      >
                        Display Position
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/createPosition"
                        className="nav-link px-0 align-middle text-white"
                      >
                        Add New Position
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <button
                  onClick={toggleCandidates}
                  className="nav-link px-0 align-middle text-white"
                  style={{ background: "none", border: "none" }}
                >
                  <i className="fs-4 bi-person"></i>{" "}
                  <span className="ms-1 d-none d-sm-inline">
                    Manage Candidates
                  </span>
                </button>
                {isCandidatesOpen && (
                  <ul>
                    <li>
                      <Link
                        to="/admin/candidate"
                        className="nav-link px-0 align-middle text-white"
                      >
                        Display Candidates
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/createCandidate"
                        className="nav-link px-0 align-middle text-white"
                      >
                        Add New Candidate
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <button
                  onClick={toggleVoters}
                  className="nav-link px-0 align-middle text-white"
                  style={{ background: "none", border: "none" }}
                >
                  <i className="fs-4 bi-people"></i>{" "}
                  <span className="ms-1 d-none d-sm-inline">Manage Voters</span>
                </button>
                {isVotersOpen && (
                  <ul>
                    <li>
                      <Link
                        to="/admin/voter"
                        className="nav-link px-0 align-middle text-white"
                      >
                        Display Voters
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/createVoter"
                        className="nav-link px-0 align-middle text-white"
                      >
                        Add New Voter
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <button
                  onClick={toggleElection}
                  className="nav-link px-0 align-middle text-white"
                  style={{ background: "none", border: "none" }}
                >
                  <i className="fs-4 bi-box2-fill"></i>{" "}
                  <span className="ms-1 d-none d-sm-inline">
                    Manage Election
                  </span>
                </button>
                {isElectionOpen && (
                  <ul>
                    <li>
                      <Link
                        to="/admin/election"
                        className="nav-link px-0 align-middle text-white"
                      >
                        Display Elections
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/createElection"
                        className="nav-link px-0 align-middle text-white"
                      >
                        Add New Election
                      </Link>{" "}
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <a
                  href="/admin/adminfeedback"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-chat-dots"></i>{" "}
                  <span className="ms-1 d-none d-sm-inline">Feedback</span>
                </a>
              </li>
              <li>
                <a
                  href="/admin/reportsummary"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-graph-up"></i>{" "}
                  <span className="ms-1 d-none d-sm-inline">
                    Report Summary
                  </span>
                </a>
              </li>
              <li onClick={handleLogout}>
                <a href="/" className="nav-link px-0 align-middle text-white">
                  <i className="fs-4 bi-power"></i>{" "}
                  <span className="ms-1 d-none d-sm-inline">Logout</span>{" "}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="col p-0 m-0">
          <div className="p-2 d-flex justify-content-center shadow">
            <h3>Voting Management System</h3>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
