import React from "react";
import PositionChart from "./PositionChart";

function PositionReport() {
  return (
    <div style={{ padding: "20px" }}>
      <div style={{ border: "2px solid black", marginTop: "5%" }}>
        {" "}
        {/* Add some margin at the top for spacing */}
        <PositionChart />
      </div>
    </div>
  );
}
export default PositionReport;
