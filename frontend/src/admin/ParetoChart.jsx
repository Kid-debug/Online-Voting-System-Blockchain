import React, { Component } from "react";
import CanvasJSReact from "@canvasjs/react-charts";

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class ParetoChart extends Component {
  constructor() {
    super();
    this.createPareto = this.createPareto.bind(this);
  }
  componentDidMount() {
    this.createPareto();
  }
  createPareto() {
    var dps = [];
    var chart = this.chart;
    var yValue,
      yTotal = 0,
      yPercent = 0;
    for (var i = 0; i < chart.data[0].dataPoints.length; i++)
      yTotal += chart.data[0].dataPoints[i].y;
    for (var i = 0; i < chart.data[0].dataPoints.length; i++) {
      yValue = chart.data[0].dataPoints[i].y;
      yPercent += (yValue / yTotal) * 100;
      dps.push({ label: chart.data[0].dataPoints[i].label, y: yPercent });
    }
    chart.addTo("data", {
      type: "line",
      yValueFormatString: "0.##" + "%",
      dataPoints: dps,
    });
    chart.data[1].set("axisYType", "secondary", false);
    chart.axisY[0].set("maximum", Math.round(yTotal / 20) * 20);
    chart.axisY2[0].set("maximum", 100);
  }
  render() {
    const options = {
      title: {
        text: "Category Voting",
      },
      axisX: {
        title: "Type of Categories",
      },
      axisY: {
        title: "Number of Voting",
        lineColor: "#4F81BC",
        tickColor: "#4F81BC",
        labelFontColor: "#4F81BC",
      },
      axisY2: {
        title: "Percentage",
        suffix: "%",
        lineColor: "#C0504E",
        tickColor: "#C0504E",
        labelFontColor: "#C0504E",
      },
      data: [
        {
          type: "column",
          dataPoints: [
            { label: "Computer Science", y: 104 },
            { label: "Badminton Club", y: 42 },
            { label: "Basketball Club", y: 20 },
            { label: "Chess Club", y: 10 },
            { label: "Football Club", y: 4 },
            { label: "Kendo Club", y: 14 },
          ],
        },
      ],
    };
    return (
      <div>
        <CanvasJSChart options={options} onRef={(ref) => (this.chart = ref)} />
      </div>
    );
  }
}

export default ParetoChart;
