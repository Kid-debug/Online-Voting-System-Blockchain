import React from "react";
import CategoryChart from "./CategoryChart";

function CategoryReport() {
  return (
    <div style={{ padding: "20px" }}>
      <div style={{ border: "2px solid black", marginTop: "5%" }}>
        {" "}
        {/* Add some margin at the top for spacing */}
        <CategoryChart />
      </div>
    </div>
  );
}
export default CategoryReport;
