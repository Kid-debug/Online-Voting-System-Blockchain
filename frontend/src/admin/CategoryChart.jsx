import React, { useState, useEffect } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import Web3 from "web3";
import votingContract from "../../../build/contracts/VotingSystem.json";
import { contractAddress } from "../../../config";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const CategoryChart = () => {
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [categoryVoteData, setCategoryVoteData] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    const fetchEventsAndExtractYears = async () => {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const contract = new web3.eth.Contract(
        votingContract.abi,
        contractAddress
      );

      const events = await contract.methods.getAllEvent().call();
      const years = new Set(
        events.map((event) =>
          new Date(Number(event.startDateTime) * 1000).getFullYear()
        )
      );
      setAvailableYears(Array.from(years).sort().reverse());

      fetchCategoryVotes(selectedYear);
    };

    fetchEventsAndExtractYears();
  }, []);

  useEffect(() => {
    fetchCategoryVotes(selectedYear);
  }, [selectedYear]);

  const fetchCategoryVotes = async (year) => {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" }); // This is the modern way to request access to accounts
    const contract = new web3.eth.Contract(votingContract.abi, contractAddress);

    const categories = await contract.methods.getAllCategory().call();
    let voteData = [];

    for (let category of categories) {
      let totalVotesForCategory = 0;
      const events = await contract.methods
        .getAllCategoryEvent(category.categoryId)
        .call();

      for (let event of events) {
        // Convert BigInt to Number, assuming the timestamp doesn't exceed the safe integer limit
        const eventYear = new Date(
          Number(event.startDateTime.toString()) * 1000
        )
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

      // Push the category with its total votes to the voteData array, even if it's zero
      voteData.push({
        label: category.categoryName,
        y: totalVotesForCategory,
      });
    }

    setCategoryVoteData(voteData);
  };

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
      text: `Vote Counts by Category for ${selectedYear}`,
    },
    axisX: {
      title: "Categories",
    },
    axisY: {
      title: "Vote Counts",
      includeZero: true,
      interval: 1, // Set interval as 1 for whole numbers
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
