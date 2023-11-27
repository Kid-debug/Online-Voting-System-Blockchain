import React from "react";
import ParetoChart from "./ParetoChart";
import PieChart from "./PieChart";
import AreaChartComponent from "./AreaChartComponent";

function ReportSummary() {
  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div
          style={{ border: "2px solid black", flex: 1, marginRight: "10px" }}
        >
          <ParetoChart />
        </div>
        <div style={{ border: "2px solid black", flex: 1, marginLeft: "10px" }}>
          <PieChart />
        </div>
      </div>
      <div style={{ border: "2px solid black", marginTop: "20px" }}>
        {" "}
        {/* Add some margin at the top for spacing */}
        <AreaChartComponent />
      </div>
    </div>
  );
}
export default ReportSummary;
