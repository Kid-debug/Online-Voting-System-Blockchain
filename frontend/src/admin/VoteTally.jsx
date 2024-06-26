import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import Web3 from "web3";
import votingContract from "../../../build/contracts/VotingSystem.json";
import { contractAddress } from "../../../config";

const VoteTally = () => {
  const [categories, setCategories] = useState([]);
  const [positions, setPositions] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [votesData, setVotesData] = useState({ series: [], categories: [] });

  useEffect(() => {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(votingContract.abi, contractAddress);
    const fetchCategories = async () => {
      const response = await contract.methods.getAllCategory().call();
      // Filter categories that have events
      const filteredCategories = response.filter(
        (cat) => cat.events && cat.events.length > 0
      );
      setCategories(filteredCategories);
      // Automatically select the first category that has events
      if (filteredCategories.length > 0) {
        setSelectedCategory(Number(filteredCategories[0].categoryId));
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(votingContract.abi, contractAddress);
    const fetchPositions = async () => {
      if (!selectedCategory) return;
      const response = await contract.methods
        .getAllCategoryEvent(selectedCategory)
        .call();
      // Filter positions that have candidates
      const filteredPositions = response.filter(
        (pos) => pos.candidates && pos.candidates.length > 0
      );
      setPositions(filteredPositions);
      // Automatically select the first position that has candidates
      if (filteredPositions.length > 0) {
        setSelectedPosition(Number(filteredPositions[0].eventId));
      } else {
        setSelectedPosition("");
      }
    };
    fetchPositions();
  }, [selectedCategory]);

  useEffect(() => {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(votingContract.abi, contractAddress);
    const fetchCandidatesAndVotes = async () => {
      if (!selectedPosition) return;
      const response = await contract.methods
        .getAllCandidatesInEvent(selectedCategory, selectedPosition)
        .call();
      let candidatesWithVotes = response.map((c) => ({
        ...c,
        // Convert BigInt to String or Number
        voteCount: Number(c.voteCount) || 0,
      }));

      // Sort candidates by vote count in descending order
      candidatesWithVotes.sort((a, b) => b.voteCount - a.voteCount);

      setCandidates(candidatesWithVotes);
      setVotesData({
        series: [
          {
            name: "Vote Count",
            data: candidatesWithVotes.map((c) => c.voteCount),
          },
        ],
        categories: candidatesWithVotes.map((c) => c.name),
      });
    };
    fetchCandidatesAndVotes();
  }, [selectedPosition, selectedCategory]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(Number(event.target.value));
    setPositions([]);
    setCandidates([]);
    setSelectedPosition("");
  };

  const handlePositionChange = (event) => {
    setSelectedPosition(Number(event.target.value));
  };

  const chartOptions = {
    chart: { type: "bar", height: 350 },
    plotOptions: { bar: { borderRadius: 4, horizontal: true } },
    dataLabels: { enabled: false },
    xaxis: {
      categories: votesData.categories,
      tickAmount: votesData.categories.length,
      labels: {
        style: {
          fontSize: "15px", // Adjust the font size as needed
        },
      },
      title: {
        text: "Total Vote Count",
        style: {
          fontSize: "20px", // Adjust the font size as needed
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "15px", // Adjust the font size as needed
          wordBreak: "break-word",
        },
      },
      forceNiceScale: true, // This should force integer values
    },
    tooltip: {
      y: {
        formatter: function (value) {
          return parseInt(value).toString(); // Format tooltip value as integer
        },
      },
    },
  };

  return (
    <div>
      <div>
        <label htmlFor="category-select">Select Category:</label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          {categories.map((category) => (
            <option
              key={category.categoryId}
              value={Number(category.categoryId)}
            >
              {category.categoryName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="position-select">Select Position:</label>
        <select
          id="position-select"
          value={selectedPosition}
          onChange={handlePositionChange}
        >
          {positions.map((position) => (
            <option key={position.eventId} value={Number(position.eventId)}>
              {position.eventName}
            </option>
          ))}
        </select>
      </div>

      <h3>
        {
          categories.find((cat) => Number(cat.categoryId) === selectedCategory)
            ?.categoryName
        }{" "}
        -{" "}
        {
          positions.find((pos) => Number(pos.eventId) === selectedPosition)
            ?.eventName
        }
      </h3>

      {votesData.series.length > 0 && (
        <ReactApexChart
          options={chartOptions}
          series={votesData.series}
          type="bar"
          height={350}
        />
      )}
    </div>
  );
};

export default VoteTally;
