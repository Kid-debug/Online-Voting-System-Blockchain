import React from "react";
import ReactApexChart from "react-apexcharts";

class VoteTally extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          data: [100, 130, 30, 55, 22, 11, 60, 40, 32, 350],
        },
      ],
      options: {
        chart: {
          type: "bar",
          height: 350,
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: [
            "Kingston",
            "John",
            "Sophia",
            "Emma",
            "Olivia",
            "Michael",
            "Ava",
            "Noah",
            "Liam",
            "Isabella",
          ],
          labels: {
            style: {
              fontSize: "12px", // Adjust the font size as needed
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              fontSize: "12px", // Adjust the font size as needed
            },
          },
          max: 500, // Set the maximum value on the y-axis to 500
        },
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="bar"
          height={350}
        />
      </div>
    );
  }
}

export default VoteTally;
