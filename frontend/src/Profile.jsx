import React, { useState,useEffect } from "react";
import Header from "./container/Header";
import Footer from "./container/Footer";
import "./stylesheets/profile.css";
import axios from "axios";
import useAuth from "./hooks/useAuth";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import Swal from "sweetalert";
import Web3 from "web3";
import votingContract from "../../build/contracts/VotingSystem.json";
import { contractAddress } from "../../config";

const TAB_ACCOUNT = "account-general";
const TAB_CHANGE_PASSWORD = "account-change-password";

function Profile() {
  const [values, setValues] = useState({
    currentPassword: "",
    newPassword: "",
    repeatNewPassword: "",
  });
  const [activeTab, setActiveTab] = useState(TAB_ACCOUNT);
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [repeatNewPasswordVisible, setRepeatNewPasswordVisible] =
    useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("");

  // Retrieve the auth context
  const { auth } = useAuth();

  useEffect(() => {
    const fetchMetaAccount = async () => {
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
        console.error("Error fetching Event:", error);
      }
    };

    fetchMetaAccount();
  }, []);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  // Reset the form fields to initial state
  const handleReset = () => {
    setValues({
      currentPassword: "",
      newPassword: "",
      repeatNewPassword: "",
    });
  };

  return (
    <div className="app-container">
      <Header />
      <main>
        <form>
          <div className="container light-style flex-grow-1 container-p-y">
            <h2 className="font-weight-bold py-3 mb-4">Edit Profile</h2>
            <div className="card-profile overflow-hidden">
              <div className="row no-gutters row-bordered row-border-light">
                <div className="col-md-3 pt-0y">
                  <div className="list-group list-group-flush account-settings-links">
                    <a
                      className={`list-group-item list-group-item-action ${
                        activeTab === TAB_ACCOUNT ? "active" : ""
                      }`}
                      onClick={() => handleTabClick(TAB_ACCOUNT)}
                    >
                      Account
                    </a>
                    <a
                      className={`list-group-item list-group-item-action ${
                        activeTab === TAB_CHANGE_PASSWORD ? "active" : ""
                      }`}
                      onClick={() => handleTabClick(TAB_CHANGE_PASSWORD)}
                    >
                      Change password
                    </a>
                  </div>
                </div>
                <div className="col-md-9">
                  <div className="tab-content custom-card-body">
                    {/* Content for General tab */}
                    <div
                      className={`tab-pane fade ${
                        activeTab === TAB_ACCOUNT ? "show active" : ""
                      }`}
                      id={TAB_ACCOUNT}
                    >
                      <div className="card-body media align-items-center">
                        <div
                          className="media-body ml-4"
                          style={{ textAlign: "center" }}
                        ></div>
                      </div>
                      <hr className="border-light m-0" />
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-12 mb-3 mt-3">
                            <label htmlFor="email" className="form-label">
                              E-mail
                            </label>
                            <input
                              id="email"
                              name="email"
                              type="email"
                              className="form-control"
                              value={auth.email}
                              disabled="true"
                            />
                          </div>
                          <div className="col-md-12 mb-3 mt-3">
                            <label htmlFor="walletAddress" className="form-label">
                              MetaMask Account
                            </label>
                            <input
                              id="walletAddress"
                              name="walletAddress"
                              type="text"
                              className="form-control"
                              value={walletAddress}
                              disabled="true"
                            />
                          </div>
                          <div className="col-md-12 mb-3 mt-3">
                            <label htmlFor="walletBalance" className="form-label">
                              Wallet Balance
                            </label>
                            <input
                              id="walletBalance"
                              name="walletBalance"
                              type="text"
                              className="form-control"
                              value={walletBalance}
                              disabled="true"
                            />
                          </div>

                          <div className="col-md-6 mb-3"></div>
                        </div>
                      </div>
                    </div>

                    {/* Content for Change Password tab */}
                    <div
                      className={`tab-pane fade ${
                        activeTab === TAB_CHANGE_PASSWORD ? "show active" : ""
                      }`}
                      id={TAB_CHANGE_PASSWORD}
                    >
                      <div className="card-body pb-2">
                        <div className="form-group mb-2 position-relative">
                          <label
                            htmlFor="currentPassword"
                            className="form-label"
                          >
                            <strong>Current password</strong>
                          </label>
                          <input
                            id="currentPassword"
                            name="currentPassword"
                            type={currentPasswordVisible ? "text" : "password"}
                            placeholder="Enter Old Password"
                            className="form-control"
                            value={values.currentPassword}
                            onChange={(e) =>
                              setValues({
                                ...values,
                                currentPassword: e.target.value,
                              })
                            }
                            required
                          />
                          <i
                            className="eye-icon"
                            onClick={() =>
                              setCurrentPasswordVisible(!currentPasswordVisible)
                            }
                          >
                            {currentPasswordVisible ? (
                              <EyeOutlined />
                            ) : (
                              <EyeInvisibleOutlined />
                            )}
                          </i>
                        </div>
                        <div className="form-group mb-2 position-relative">
                          <label htmlFor="newPassword" className="form-label">
                            <strong>New password</strong>
                          </label>
                          <input
                            id="newPassword"
                            name="newPassword"
                            type={newPasswordVisible ? "text" : "password"}
                            placeholder="Enter New Password"
                            className="form-control"
                            value={values.newPassword}
                            onChange={(e) =>
                              setValues({
                                ...values,
                                newPassword: e.target.value,
                              })
                            }
                            required
                          />
                          <i
                            className="eye-icon"
                            onClick={() =>
                              setNewPasswordVisible(!newPasswordVisible)
                            }
                          >
                            {newPasswordVisible ? (
                              <EyeOutlined />
                            ) : (
                              <EyeInvisibleOutlined />
                            )}
                          </i>
                        </div>
                        <div className="form-group mb-2 position-relative">
                          <label
                            htmlFor="repeatNewPassword"
                            className="form-label"
                          >
                            <strong>Repeat new password</strong>
                          </label>
                          <input
                            id="repeatNewPassword"
                            name="repeatNewPassword"
                            type={
                              repeatNewPasswordVisible ? "text" : "password"
                            }
                            placeholder="Enter Confirm Password"
                            className="form-control"
                            value={values.repeatNewPassword}
                            onChange={(e) =>
                              setValues({
                                ...values,
                                repeatNewPassword: e.target.value,
                              })
                            }
                            required
                          />
                          <i
                            className="eye-icon"
                            onClick={() =>
                              setRepeatNewPasswordVisible(
                                !repeatNewPasswordVisible
                              )
                            }
                          >
                            {repeatNewPasswordVisible ? (
                              <EyeOutlined />
                            ) : (
                              <EyeInvisibleOutlined />
                            )}
                          </i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right mt-3">
              <button type="submit" className="btn btn-primary rounded-0">
                <i className="bi bi-check"></i>
                Save
              </button>
              &nbsp;
              <button
                type="button"
                className="btn btn-default rounded-0"
                onClick={handleReset}
              >
                <i className="bi bi-arrow-counterclockwise"></i>
                Reset
              </button>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}

export default Profile;
