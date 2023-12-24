import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import votingContract from "../../../../build/contracts/VotingSystem.json";
import Web3 from "web3";
import { contractAddress } from "../../../../config";
import Swal from "sweetalert";

function EditCategory() {
  const [categoryName, setCategoryName] = useState("");

  const navigate = useNavigate();
  const { categoryId } = useParams();

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();

        const contract = new web3.eth.Contract(
          votingContract.abi,
          contractAddress
        );

        const category = await contract.methods
          .getCategoryById(categoryId)
          .call();

        // Update the state with the fetched category name
        setCategoryName(category.categoryName);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategoryDetails();
  }, [categoryId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!categoryName.trim()) {
      Swal("Error!", "Category input fields must be filled in.", "error");
      return;
    }

    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(
        votingContract.abi,
        contractAddress
      );
      const category = await contract.methods.getCategoryById(categoryId).call();

<<<<<<< HEAD
      category.categoryName = categoryName;
=======
      // Fetch all categories
      const allCategories = await contract.methods.getAllCategory().call();

      // Check if another category with the same name exists (excluding the current category)
      const isCategoryNameTaken = allCategories.some(
        (cat) =>
          cat.categoryName === categoryName &&
          String(cat.categoryId) !== categoryId
      );

      if (isCategoryNameTaken) {
        Swal(
          "Error!",
          "Category name already taken. Please choose a different name.",
          "error"
        );
        return;
      }

>>>>>>> d1445e04e38b3f6a0df4176b260abc31a897e4cd
      await contract.methods
        .updateCategory(category)
        .send({ from: accounts[0] });

      Swal("Success!", "Category updated successfully.", "success");
    } catch (error) {
      console.error("Updating Category error:", error);

      let errorMessage = "An error occurred while updating the category.";
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
        title: "Error updating category!",
        text: errorMessage,
      });
    }
  };

  return (
    <div className="d-flex flex-column align-items-center pt-4">
      <h2>Update Category</h2>
      <form className="row g-3 w-50" onSubmit={handleSubmit}>
        <div className="col-12">
          <label htmlFor="inputCategoryname" className="form-label">
            Category Name
          </label>
          <input
            type="text"
            className="form-control"
            id="inputCategoryname"
            placeholder="Enter Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
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

export default EditCategory;
