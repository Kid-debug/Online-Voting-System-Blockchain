import React, { useState, useEffect } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import Web3 from "web3";
import votingContract from "../../../build/contracts/VotingSystem.json";
import { contractAddress } from "../../../config";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const CategoryChart = () => {
  const [selectedYear, setSelectedYear] = useState("");
  const [categoryVoteData, setCategoryVoteData] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    const fetchEventsAndExtractYears = async () => {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const contract = new web3.eth.Contract(
        votingContract.abi,
        contractAddress
      );

      const events = await contract.methods.getAllEvent().call();
      const validEvents = events.filter(
        (event) => Number(event.startDateTime) !== 0
      ); // Filter out events with a timestamp of 0
      const years = new Set(
        validEvents.map((event) =>
          new Date(Number(event.startDateTime) * 1000).getFullYear()
        )
      );
      const yearsArray = Array.from(years).sort((a, b) => b - a); // Sort years in descending order
      setAvailableYears(yearsArray);

      if (yearsArray.length > 0) {
        const latestYear = yearsArray[0].toString();
        setSelectedYear(latestYear);
        fetchCategoryVotes(latestYear);
      }
    };

    fetchEventsAndExtractYears();
  }, []);

  useEffect(() => {
    fetchCategoryVotes(selectedYear);
  }, [selectedYear]);

  const fetchCategoryVotes = async (year) => {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const contract = new web3.eth.Contract(votingContract.abi, contractAddress);

    const categories = await contract.methods.getAllCategory().call();
    let voteData = [];

    for (let category of categories) {
      let totalVotesForCategory = 0;
      const events = await contract.methods
        .getAllCategoryEvent(category.categoryId)
        .call();

      for (let event of events) {
        const eventYear = new Date(Number(event.startDateTime) * 1000)
          .getFullYear()
          .toString();
        if (eventYear === year) {
          const candidates = await contract.methods
            .getAllCandidatesInEvent(category.categoryId, event.eventId)
            .call();
          for (let candidate of candidates) {
            totalVotesForCategory += parseInt(candidate.voteCount);
          }
        }
      }

      if (totalVotesForCategory > 0 || events.length > 0) {
        // Include categories with total vote count > 0 or events created
        voteData.push({
          label: category.categoryName,
          y: totalVotesForCategory,
        });
      }
    }

    setCategoryVoteData(voteData);
  };

  const exportChart = async (type) => {
    try {
      const canvas = await html2canvas(
        document.querySelector(".canvasjs-chart-canvas")
      );

      if (!canvas) {
        console.error("Canvas is null or undefined.");
        return;
      }

      // Create a new jsPDF instance
      const pdf = new jsPDF("landscape");

      // Add the canvas image to the PDF
      pdf.addImage(canvas, "JPEG", 10, 10, 280, 150);

      // Download the PDF
      pdf.save(`chart.${type}`);
    } catch (error) {
      console.error("Error exporting chart to PDF:", error);
    }
  };

  const options = {
    animationEnabled: true,
    title: {
      text: `${selectedYear} - Total Vote Counts of Categories`,
    },
    axisX: {
      title: "Categories",
    },
    axisY: {
      title: "Number of Votes",
      includeZero: true,
      interval: 10, // Set interval as 1 for whole numbers
      valueFormatString: "#0", // Format labels as integers
    },
    data: [
      {
        type: "column",
        dataPoints: categoryVoteData,
      },
    ],
  };

  return (
    <div>
      <label htmlFor="year-select">Select Year: </label>
      <select
        id="year-select"
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
      >
        {availableYears.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

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

export default CategoryChart;
