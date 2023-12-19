import React from "react";
import AreaChartComponent from "./AreaChartComponent";

function YearlyReport() {
  return (
    <div style={{ padding: "20px" }}>
      <div style={{ border: "2px solid black", marginTop: "5%" }}>
        {" "}
        {/* Add some margin at the top for spacing */}
        <AreaChartComponent />
      </div>
    </div>
  );
}
export default YearlyReport;
