import React from "react";
import AreaChartComponent from "./AreaChartComponent";
import { Link } from "react-router-dom";

function YearlyReport() {
  return (
    <div style={{ padding: "20px" }}>
      <div style={{ border: "2px solid black", marginTop: "5%" }}>
        {" "}
        {/* Add some margin at the top for spacing */}
        <AreaChartComponent />
      </div>
      <div className="d-flex justify-content-center mt-5">
        <Link to="/admin/home" className="btn btn-secondary">
          Back To Dashboard
        </Link>
      </div>
    </div>
  );
}
export default YearlyReport;
