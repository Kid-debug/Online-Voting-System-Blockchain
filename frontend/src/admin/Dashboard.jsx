import React, { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import Web3 from "web3";

function Dashboard() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isPositionOpen, setIsPositionOpen] = useState(false);
  const [isCandidatesOpen, setIsCandidatesOpen] = useState(false);
  const [isVotersOpen, setIsVotersOpen] = useState(false);
  const [isAdminsOpen, setIsAdminsOpen] = useState(false);
  const [isElectionOpen, setIsElectionOpen] = useState(false);

  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("");

  const { logout } = useAuth();
  const { auth } = useAuth();
  const role = auth.userRole;
  const userId = auth.userId;

  const handleLogout = async () => {
    try {
      // Send a logout request to the server
      await axios.get(
        "http://localhost:3000/api/logout",
        {},
        { withCredentials: true }
      );
      // Call the logout function from the context
      logout();

      // Navigate to the login page
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
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

  const toggleAdmins = () => {
    setIsAdminsOpen(!isAdminsOpen);
  };

  async function requestAccount() {
    console.log("Requesting account...");

    // Check if Meta Mask Extension exists
    if (window.ethereum) {
      console.log("detected");

      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        setWalletAddress(accounts[0]);

        // get balance
        const web3 = new Web3(window.ethereum);
        const balance = await web3.eth.getBalance(accounts[0]);
        const walletBalance = web3.utils.fromWei(balance, "ether");
        console.log("Balance:", balance);
        setWalletBalance(walletBalance);
      } catch (error) {
        console.error("Error connecting:", error);
      }
    } else {
      alert("Meta Mask not detected");
    }
  }

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
                  </ul>
                )}
              </li>
              {role === "S" && (
                <li>
                  <button
                    onClick={toggleAdmins}
                    className="nav-link px-0 align-middle text-white"
                    style={{ background: "none", border: "none" }}
                  >
                    <i className="fs-4 bi-people"></i>{" "}
                    <span className="ms-1 d-none d-sm-inline">
                      Manage Admins
                    </span>
                  </button>
                  {isAdminsOpen && (
                    <ul>
                      <li>
                        <Link
                          to="/admin/admin"
                          className="nav-link px-0 align-middle text-white"
                        >
                          Display Admin
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/createAdmin"
                          className="nav-link px-0 align-middle text-white"
                        >
                          Add New Admin
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              )}
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
              {role === "A" && (
                <li>
                  <Link
                    to={`/admin/editAdmin/${userId}`}
                    className="nav-link px-0 align-middle text-white"
                  >
                    <i className="fs-4 bi-lock"></i>{" "}
                    <span className="ms-1 d-none d-sm-inline">
                      Change Password
                    </span>
                  </Link>
                </li>
              )}
              <li>
                <div className="App">
                  <header className="App-header">
                    <button onClick={requestAccount}>Request Account</button>
                    <p>Wallet Address: {walletAddress}</p>
                    <p>Wallet Balance: {walletBalance}</p>
                  </header>
                </div>
              </li>
              <li onClick={handleLogout}>
                <a href="#" className="nav-link px-0 align-middle text-white">
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
