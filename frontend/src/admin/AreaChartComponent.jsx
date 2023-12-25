import React, { useState, useEffect } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import Web3 from "web3";
import votingContract from "../../../build/contracts/VotingSystem.json";
import { contractAddress } from "../../../config";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const AreaChartComponent = () => {
  const [yearlyVoteCounts, setYearlyVoteCounts] = useState([]);

  useEffect(() => {
    const fetchVoteCountByYear = async () => {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const contract = new web3.eth.Contract(
        votingContract.abi,
        contractAddress
      );

      const categories = await contract.methods.getAllCategory().call();
      let votesByYear = {};

      for (let category of categories) {
        const events = await contract.methods
          .getAllCategoryEvent(category.categoryId)
          .call();
        for (let event of events) {
          const year = new Date(
            parseInt(event.endDateTime) * 1000
          ).getFullYear();
          votesByYear[year] = votesByYear[year] || 0;

          const candidates = await contract.methods
            .getAllCandidatesInEvent(category.categoryId, event.eventId)
            .call();
          for (let candidate of candidates) {
            votesByYear[year] += parseInt(candidate.voteCount);
          }
        }
      }

      const sortedYears = Object.entries(votesByYear).map(([year, votes]) => ({
        year,
        votes,
      }));
      sortedYears.sort((a, b) => parseInt(b.year) - parseInt(a.year));
      setYearlyVoteCounts(sortedYears);
    };

    fetchVoteCountByYear();
  }, []);

  const exportChart = async (type) => {
    const canvas = await html2canvas(
      document.querySelector(".canvasjs-chart-canvas")
    );
    const image = canvas.toDataURL(`image/${type}`);
    const downloadLink = document.createElement("a");
    downloadLink.href = image;
    downloadLink.download = `chart.${type}`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const options = {
    animationEnabled: true,
    title: {
      text: "Total Vote Counts by Year",
    },
    axisX: {
      title: "Year",
    },
    axisY: {
      title: "Number of Votes",
      includeZero: true,
      interval: 1,
      valueFormatString: "#0",
      gridThickness: 0,
      tickLength: 0,
    },
    data: [
      {
        type: "column",
        dataPoints: yearlyVoteCounts.map((voteCount) => ({
          label: voteCount.year.toString(),
          y: voteCount.votes,
        })),
      },
    ],
  };

  return (
    <div>
      <CanvasJSChart options={options} />
      <div>
        <button style={{ margin: "10px" }} onClick={() => exportChart("jpg")}>
          Export as JPG
        </button>
        <button style={{ margin: "10px" }} onClick={() => exportChart("png")}>
          Export as PNG
        </button>
        <button style={{ margin: "10px" }} onClick={() => exportChart("pdf")}>
          Export as PDF
        </button>
      </div>
    </div>
  );
};

export default AreaChartComponent;
