import React, { useState, useEffect } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import Web3 from "web3";
import votingContract from "../../../build/contracts/VotingSystem.json";
import { contractAddress } from "../../../config";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const PositionChart = () => {
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [dataPoints, setDataPoints] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const contract = new web3.eth.Contract(
        votingContract.abi,
        contractAddress
      );
      const fetchedCategories = await contract.methods.getAllCategory().call();
      const fetchedEvents = await contract.methods.getAllEvent().call();

      const categoryOptions = fetchedCategories.map((category) => ({
        label: category.categoryName,
        value: Number(category.categoryId),
      }));
      setCategories(categoryOptions);

      // Set the first category as the default selected category
      if (categoryOptions.length > 0) {
        setSelectedCategory(categoryOptions[0].value.toString());
      }

      const years = new Set(
        fetchedEvents.map((event) => {
          // Convert BigInt to Number before multiplying
          const eventYear = new Date(Number(event.startDateTime) * 1000)
            .getFullYear()
            .toString();
          return eventYear;
        })
      );
      const yearsArray = Array.from(years).sort().reverse();
      setAvailableYears(yearsArray);

      // Set the first year as the default selected year
      if (yearsArray.length > 0) {
        setSelectedYear(yearsArray[0]);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchDataPoints = async () => {
      console.log(selectedCategory, selectedYear);
      if (selectedCategory && selectedYear) {
        try {
          const web3 = new Web3(window.ethereum);
          await window.ethereum.enable(); // Ensure that the user has given permission
          const contract = new web3.eth.Contract(
            votingContract.abi,
            contractAddress
          );

          const categoryEvents = await contract.methods
            .getAllCategoryEvent(selectedCategory)
            .call();

          const filteredEvents = categoryEvents.filter((event) => {
            const eventYear = new Date(
              Number(event.startDateTime) * 1000
            ).getFullYear();
            return eventYear.toString() === selectedYear;
          });

          let voteData = [];
          for (let event of filteredEvents) {
            const candidates = await contract.methods
              .getAllCandidatesInEvent(selectedCategory, event.eventId)
              .call();
            const totalVotes = candidates.reduce(
              (sum, candidate) => sum + Number(candidate.voteCount),
              0
            );
            voteData.push({ label: event.eventName, y: totalVotes });
          }

          setDataPoints(voteData);
        } catch (error) {
          console.error("Error fetching data points:", error);
        }
      } else {
        setDataPoints([]); // Clear the chart if no category or year is selected
      }
    };

    fetchDataPoints();
  }, [selectedYear, selectedCategory]);

  const handleCategoryChange = (e) => {
    console.log("Changing category to:", e.target.value);
    setSelectedCategory(e.target.value);
    // Immediately call updateDataPoints to reflect changes
    // This is not typically recommended; instead rely on useEffect to handle updates
    // updateDataPoints();
  };

  const options = {
    animationEnabled: true,
    title: {
      text: `${selectedYear} - Total Vote Counts by Event`,
    },
    axisX: {
      title: "Events",
    },
    axisY: {
      title: "Number of Votes",
      includeZero: true,
      interval: 1, // Set interval as 1 for whole numbers
      valueFormatString: "#0", // Format labels as integers
    },
    data: [
      {
        type: "column",
        dataPoints: dataPoints,
      },
    ],
  };

  return (
    <div>
      <div>
        <label htmlFor="year-select">Select Year: </label>
        <select
          id="year-select"
          value={selectedYear || ""}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <label htmlFor="category-select">Select Category: </label>
        <select
          id="category-select"
          value={
            selectedCategory ||
            (categories.length > 0 && categories[0].value) ||
            ""
          }
          onChange={handleCategoryChange}
        >
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <CanvasJSChart options={options} />
    </div>
  );
};

export default PositionChart;
