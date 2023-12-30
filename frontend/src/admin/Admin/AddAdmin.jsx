import React, { useState } from "react";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import votingContract from "../../../../build/contracts/VotingSystem.json";
import Web3 from "web3";
import { contractAddress } from "../../../../config";
import Swal from "sweetalert";
import axios from "../../api/axios";
import cryptoRandomString from "crypto-random-string";

function AddAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleAddAdmin = async (event) => {
    event.preventDefault();

    const errors = validateSignUp();

    // If there are no errors, proceed with form submission
    if (Object.keys(errors).length === 0) {
      try {
        const emailLower = email.toLowerCase();
        // Generate a verification token
        const randomToken = cryptoRandomString({ length: 16 });
        // Insert the valid user in to the blockchain
        const voterId = cryptoRandomString({ length: 16 });

        try {
          const web3 = new Web3(window.ethereum);
          await window.ethereum.enable();
          const accounts = await web3.eth.getAccounts();
          const contract = new web3.eth.Contract(
            votingContract.abi,
            contractAddress
          );

          // Use getAllVoter to check if the email exists
          const voters = await contract.methods.getAllVoter().call();

          // Check if email already exists
          const emailLower = email.toLowerCase();

          const existingVoter = voters.find(
            (voter) => voter.email.toLowerCase() === emailLower
          );

          if (existingVoter) {
            Swal("Error!", "This email already exists.", "error");
            return;
          }

          await contract.methods
            .addVoter(voterId, emailLower, password, "A", randomToken)
            .send({ from: accounts[0] });

          // prompt success message
          Swal({
            icon: "success",
            title: "Admin Created!",
            text: "You've successfully added a new admin account.",
          });

          await axios.post("/api/verifyEmail", {
            email,
            randomToken,
          });

          console.log("Form submitted successfully");
        } catch (error) {
          let errorMessage =
            "An error occurred while creating the admin account.";
          // Check if the error message includes a revert
          if (error.message && error.message.includes("revert")) {
            const matches = error.message.match(/revert (.+)/);
            errorMessage =
              matches && matches[1]
                ? matches[1]
                : "Transaction reverted without a reason.";
          } else if (error.message) {
            errorMessage = error.message;
          }
          Swal({
            icon: "error",
            title: "Error creating admin account!",
            text: errorMessage,
          });
        }
      } catch (error) {
        let errorMessage =
          "An error occurred while creating the admin account.";
        // Check if the error message includes a revert
        if (error.message && error.message.includes("revert")) {
          const matches = error.message.match(/revert (.+)/);
          errorMessage =
            matches && matches[1]
              ? matches[1]
              : "Transaction reverted without a reason.";
        } else if (error.message) {
          errorMessage = error.message;
        }
        Swal({
          icon: "error",
          title: "Error creating admin account!",
          text: errorMessage,
        });
      }
    } else {
      // Handle errors (e.g., display error messages)
      console.log("Form contains errors:", errors);
      Swal({
        icon: "error",
        title: "Failed to Add Admin!",
        text: Object.values(errors).join("\n"),
      });
    }
  };

  const validateSignUp = () => {
    const errors = {};

    // Check if email is not empty
    if (!email.trim()) {
      errors.email = "•Email is required";
    }

    // Check if password is not empty and meets requirements
    if (!password.trim()) {
      errors.password = "•Password is required";
    } else if (password.length < 8) {
      errors.password = "•Password must be at least 8 characters long";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password)
    ) {
      errors.password =
        "•Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character";
    } else if (password.length > 40) {
      errors.password = "•Password cannot more than 40 characters.";
    }

    return errors;
  };

  return (
    <div className="d-flex flex-column align-items-center pt-4">
      <h2>Add Admin Account</h2>
      <form className="row g-3 w-50" onSubmit={handleAddAdmin}>
        <div className="col-12">
          <label htmlFor="inputAdminEmail" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            id="inputAdminEmail"
            name="inputAdminEmail"
            className="form-control"
            placeholder="Enter Email Address (eg: admin@gmail.com)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="col-12">
          <label htmlFor="inputPassword" className="form-label">
            Password
          </label>
          <input
            type={passwordVisible ? "text" : "password"}
            id="inputPassword"
            name="inputPassword"
            className="form-control"
            placeholder="Enter Password (eg: Abc!1234)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <i
            className="eye-icon"
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          </i>
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            Create
          </button>
        </div>
      </form>
      <button onClick={() => navigate(-1)} className="btn btn-secondary mb-3">
        Back
      </button>
    </div>
  );
}

export default AddAdmin;
