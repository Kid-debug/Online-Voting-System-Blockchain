import React from "react";
import CategoryChart from "./CategoryChart";
import { Link } from "react-router-dom";

function CategoryReport() {
  return (
    <div style={{ padding: "20px" }}>
      <div style={{ border: "2px solid black", marginTop: "5%" }}>
        {" "}
        {/* Add some margin at the top for spacing */}
        <CategoryChart />
      </div>
      <div className="d-flex justify-content-center mt-5">
        <Link to="/admin/home" className="btn btn-secondary">
          Back To Dashboard
        </Link>
      </div>
    </div>
  );
}
export default CategoryReport;
