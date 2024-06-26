import React, { useState } from "react";
import { Link } from "react-router-dom";
import votingContract from "../../../../build/contracts/VotingSystem.json";
import Web3 from "web3";
import { contractAddress } from "../../../../config";
import Swal from "sweetalert";

function AddCategory() {
  const [categoryName, setCategoryName] = useState("");

  const handleCategoryChange = (event) => {
    setCategoryName(event.target.value.toUpperCase());
  };

  const handleAddCategory = async (event) => {
    event.preventDefault(); // Prevent the default form submission
    if (!categoryName) {
      Swal("Error!", "Category input fields must be filled in.", "error");
      return;
    }
    if (categoryName.length > 20) {
      Swal("Error!", "Category name cannot more than 20 character.", "error");
      return;
    }

    console.log("Length : ", categoryName.length);

    try {
      // const ganacheUrl = "HTTP://127.0.0.1:7545"; // Replace with your Ganache URL
      // const privateKey = '0x7e714a5c55233c1adc7400de839ece13c124d433b1266178211e948ffa1f7a5d';

      console.log("Attempting to add category...");

      //  const web3 = new Web3(new Web3.providers.HttpProvider(ganacheUrl));

      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const accounts = await web3.eth.getAccounts();
      console.log("contract address", contractAddress);

      const contract = new web3.eth.Contract(
        votingContract.abi,
        contractAddress
      );

      //Check if the category name cannot be same with others when adding
      // Fetch all categories
      const categories = await contract.methods.getAllCategory().call();
      const categoryNames = categories.map((category) => category.categoryName);

      // Check if the category name already exists
      if (categoryNames.includes(categoryName)) {
        Swal("Error!", "This category name already exists.", "error");
        return;
      }

      //const account = web3.eth.accounts.privateKeyToAccount(privateKey);
      //web3.eth.accounts.wallet.add(account);

      // Call the addCategory function in your smart contract
      await contract.methods.addCategory(categoryName).send({
        from: accounts[0],
      });

      // await contract.methods.addCategory(categoryName).send({
      //   from: account.address,
      //   gas: 200000,
      // })

      // prompt success message
      Swal({
        icon: "success",
        title: "Category Created!",
        text: "You've successfully added a new category.",
      });
      console.log("Category added successfully");
    } catch (error) {
      let errorMessage = "An error occurred while creating the category.";
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
      Swal.fire({
        icon: "error",
        title: "Error creating category!",
        text: errorMessage,
      });
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
