import React, { useState } from "react";
import Header from "./container/Header";
import Footer from "./container/Footer";
import "./profile.css";

const TAB_ACCOUNT = "account-general";
const TAB_CHANGE_PASSWORD = "account-change-password";

function Profile() {
  const [activeTab, setActiveTab] = useState(TAB_ACCOUNT);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  // Initial form state
  const initialFormState = {
    firstName: "2205500",
    lastName: "Ng Hooi Seng",
    email: "nghs-wm20@student.tarc.edu.my",
    phoneNumber: "0111345678",
    currentPassword: "",
    newPassword: "",
    repeatNewPassword: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Reset the form fields to initial state
  const handleReset = () => {
    setFormData(initialFormState);
  };

  return (
    <div className="app-container">
      <Header />
      <main>
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
                          <label htmlFor="fullName" className="form-label">
                            Full Name
                          </label>
                          <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            className="form-control"
                            value={formData.lastName}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-12 mb-3">
                          <label htmlFor="email" className="form-label">
                            E-mail
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleInputChange}
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
                      <div className="form-group mb-2">
                        <label htmlFor="currentPassword" className="form-label">
                          Current password
                        </label>
                        <input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          className="form-control"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group mb-2">
                        <label htmlFor="newPassword" className="form-label">
                          New password
                        </label>
                        <input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          className="form-control"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group mb-2">
                        <label
                          htmlFor="repeatNewPassword"
                          className="form-label"
                        >
                          Repeat new password
                        </label>
                        <input
                          id="repeatNewPassword"
                          name="repeatNewPassword"
                          type="password"
                          className="form-control"
                          value={formData.repeatNewPassword}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right mt-3">
            <button type="button" className="btn btn-primary rounded-0">
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
      </main>
      <Footer />
    </div>
  );
}

export default Profile;
