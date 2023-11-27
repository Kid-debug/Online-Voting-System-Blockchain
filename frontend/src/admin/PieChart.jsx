import React from "react";
import CanvasJSReact from "@canvasjs/react-charts";

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function PieChart() {
  const options = {
    exportEnabled: true,
    animationEnabled: true,
    title: {
      text: "Election Voting",
    },
    data: [
      {
        type: "pie",
        startAngle: 75,
        toolTipContent: "<b>{label}</b>: {y}%",
        showInLegend: "true",
        legendText: "{label}",
        indexLabelFontSize: 16,
        indexLabel: "{label} - {y}%",
        dataPoints: [
          { y: 18, label: "2023 FOAS Election" },
          { y: 49, label: "2023 FOCS Election" },
          { y: 9, label: "2023 FOAS Election" },
          { y: 5, label: "2023 FAFB Election" },
          { y: 19, label: "2023 SRC Election" },
        ],
      },
    ],
  };
  return (
    <div>
      <CanvasJSChart options={options} />
    </div>
  );
}

export default PieChart;
