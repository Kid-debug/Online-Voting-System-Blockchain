import React, { useState, useEffect } from "react";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import votingContract from "../../../../build/contracts/VotingSystem.json";
import Web3 from "web3";
import { contractAddress } from "../../../../config";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert";
import axios from "../../api/axios";

function EditAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  //retrieve email and password function
  const { auth } = useAuth();
  const key = auth.userKey;
  const id = auth.userId;
  const role = auth.userRole;

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();

        const contract = new web3.eth.Contract(
          votingContract.abi,
          contractAddress
        );

        const admin = await contract.methods.getVoterEmailById(id).call();
        console.log(id);
        setEmail(admin);
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };

    fetchAdminDetails();
  }, [id]);

  //handle EditAdmin function
  const handleEditAdmin = async (event) => {
    event.preventDefault();

    const errors = validateEditPassword();

    // If there are no errors, proceed with form submission
    if (Object.keys(errors).length === 0) {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        const contract = new web3.eth.Contract(
          votingContract.abi,
          contractAddress
        );

        await contract.methods
          .updateVoterPassword(key, password)
          .send({ from: accounts[0] });

        // prompt success message
        Swal("Success!", "Your password updated successfully.", "success");

        console.log("Form submitted successfully");
      } catch (error) {
        let errorMessage = "An error occurred while updating your password.";
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
          title: "Error updating your password!",
          text: errorMessage,
        });
      }
    } else {
      // Handle errors (e.g., display error messages)
      console.log("Form contains errors:", errors);
      Swal({
        icon: "error",
        title: "Failed to Update Password!",
        text: Object.values(errors).join("\n"),
      });
    }
  };

  const validateEditPassword = () => {
    const errors = {};

    // Check if password is not empty and meets requirements
    if (role == "A") {
      if (!password.trim()) {
        errors.password = "•Password is required";
      } else if (password.length < 8) {
        errors.password = "•Password must be at least 8 characters long";
      } else if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password)
      ) {
        errors.password =
          "•Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character";
      }
    }

    return errors;
  };

  return (
    <div className="d-flex flex-column align-items-center pt-4">
      <h2>{role === "A" ? "Change Password" : "Update Admin Email"}</h2>
      <form className="row g-3 w-50" onSubmit={handleEditAdmin}>
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
            disabled={role === "A"}
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
            Edit
          </button>
        </div>
      </form>
      <button onClick={() => navigate(-1)} className="btn btn-secondary mb-3">
        Back
      </button>
    </div>
  );
}

export default EditAdmin;
