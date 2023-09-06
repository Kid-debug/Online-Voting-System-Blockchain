import React from "react";
import { Link } from "react-router-dom";

function EditVoter() {
  //left back-end part
  return (
    <div className="d-flex flex-column align-items-center pt-4">
      <h2>Update Voter</h2>
      <form class="row g-3 w-50">
        <div class="col-12">
          <label htmlFor="inputFirstname4" className="form-label">
            First Name
          </label>
          <input
            type="text"
            className="form-control"
            id="inputFirstname4"
            placeholder="Enter First Name (eg: Ng)"
            value="Ng"
          />
        </div>
        <div class="col-12">
          <label htmlFor="inputLastname4" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            className="form-control"
            id="inputLastname4"
            placeholder="Enter Last Name (eg: Hooi Seng)"
            value="Hooi Seng"
          />
        </div>
        <div class="col-12">
          <label htmlFor="inputUsername4" className="form-label">
            Student ID
          </label>
          <input
            type="text"
            className="form-control"
            id="inputUsername4"
            placeholder="Enter Student ID (eg: 2205578)"
            value="2205578"
          />
        </div>
        <div class="col-12">
          <label htmlFor="inputPhonenum4" className="form-label">
            Phone Number
          </label>
          <input
            type=""
            className="form-control"
            id="inputPhonenum4"
            placeholder="Enter Phone Number (eg: 01110789007) "
            value="01110789007"
          />
        </div>
        <div class="col-12">
          <label htmlFor="inputEmail4" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="inputEmail4"
            placeholder="Enter Email (eg: nghs-wm20@student.tarc.edu.my)"
            value="nghs-wm20@student.tarc.edu.my"
          />
        </div>
        <div className="col-12 mb-3 d-flex flex-column align-items-start">
          <label htmlFor="inputGroupFile01" className="form-label">
            Edit Image
            <input
              type="file"
              className="visually-hidden"
              id="inputGroupFile01"
            />
          </label>
          <label htmlFor="inputGroupFile01">
            <img src="public/img1.jpg" alt="" className="voter_image" />
          </label>
        </div>

        <div class="col-12">
          <button type="submit" class="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditVoter;