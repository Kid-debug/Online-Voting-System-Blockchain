import React, { Component } from "react";
import CanvasJSReact from "@canvasjs/react-charts";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

class AreaChartComponent extends Component {
  render() {
    const options = {
      theme: "light2",
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "Number of Voters Voted in 2023",
      },
      axisX: {
        valueFormatString: "MMMM", // Formatting the x-axis to display months
      },
      axisY: {
        title: "Number of Voter",
        minimum: 0, // Setting minimum value for y-axis
        maximum: 1000, // Setting maximum value for y-axis
      },
      data: [
        {
          type: "area",
          xValueFormatString: "MMMM YYYY",
          yValueFormatString: "#,##0",
          dataPoints: [
            { x: new Date(2023, 0), y: 76 },
            { x: new Date(2023, 1), y: 78 },
            { x: new Date(2023, 2), y: 73 },
            { x: new Date(2023, 3), y: 75 },
            { x: new Date(2023, 4), y: 74 },
            { x: new Date(2023, 5), y: 79 },
            { x: new Date(2023, 6), y: 80 },
            { x: new Date(2023, 7), y: 81 },
            { x: new Date(2023, 8), y: 77 },
            { x: new Date(2023, 9), y: 70 },
            { x: new Date(2023, 10), y: 200 },
            { x: new Date(2023, 11), y: 500 },
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
}

export default AreaChartComponent;
