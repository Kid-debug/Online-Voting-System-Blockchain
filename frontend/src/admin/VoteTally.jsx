import React from "react";
import ReactApexChart from "react-apexcharts";

class VoteTally extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          data: [3, 0, 1, 2, 0, 0, 0, 0, 0, 0],
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
            "Chin Khai Ray",
            "Chin Zi Xin",
            "Lim Er Hao",
            "Tee Fo Yo",
            "Lee Sze Yen",
            "Tan Wei Jie",
            "Wong Mei Ling",
            "Lim Eng Chuan",
            "Chong Mei Yen	",
            "Ng Wei Lun",
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
          max: 200, // Set the maximum value on the y-axis to 500
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
