import React, { useState } from "react";
import { Link } from "react-router-dom";
import votingContract from "../../../../build/contracts/VotingSystem.json";
import Web3 from "web3";
import { contractAddress } from "../../config";
import Swal from "sweetalert";

function AddCategory() {
  const [categoryName, setCategoryName] = useState("");

  const handleCategoryChange = (event) => {
    setCategoryName(event.target.value);
  };

  const handleAddCategory = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    try {
      console.log("Attempting to add category...");
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const accounts = await web3.eth.getAccounts();
      console.log("contract address", contractAddress);

      const contract = new web3.eth.Contract(
        votingContract.abi,
        contractAddress
      );

      console.log("contract", contract);

      // Call the addCategory function in your smart contract
      await contract.methods.addCategory(categoryName).send({
        from: accounts[0],
      });

      // prompt success message
      Swal({
        icon: "success",
        title: "Category Created!",
        text: "You've successfully added a new category.",
      });
      console.log("Category added successfully");
    } catch (error) {
      // Check for specific error messages
      if (error.message.includes("Category already exists")) {
        // Display the exact error message from Solidity
        Swal({
          icon: "error",
          title: "Error creating category!",
          text: "Category already exists",
        });
      }
      // For other errors, show the full error message
      else
        Swal({
          icon: "error",
          title: "Error creating category!",
          text: "An error occurred while creating the category. Please try again.",
        });

      console.error("Error adding category:", error);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center pt-4">
      <h2>Add Category</h2>
      <form className="row g-3 w-50" onSubmit={handleAddCategory}>
        <div className="col-12">
          <label htmlFor="inputCategoryName" className="form-label">
            Category Name
          </label>
          <input
            type="text"
            className="form-control"
            id="inputCategoryName"
            placeholder="Enter your category name (e.g., Chess Club)"
            value={categoryName}
            onChange={handleCategoryChange}
          />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            Create
          </button>
        </div>
      </form>
      <Link to="/admin/category" className="btn btn-secondary mt-3">
        Back
      </Link>
    </div>
  );
}

export default AddCategory;
