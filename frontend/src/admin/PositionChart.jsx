import React, { useState, useEffect } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import Web3 from "web3";
import votingContract from "../../../build/contracts/VotingSystem.json";
import { contractAddress } from "../../../config";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const EventVoteChart = () => {
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [events, setEvents] = useState([]);
  const [dataPoints, setDataPoints] = useState([]);

  useEffect(() => {
    // Fetch Available Years
    const fetchYears = async () => {
      try {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(
          votingContract.abi,
          contractAddress
        );

        const years = await contract.methods.getAvailableYears().call();
        if (years && years.length > 0) {
          setAvailableYears(years.map((year) => year.toString()));
          setSelectedYear(years[0].toString()); // Automatically select the first year
        }
      } catch (error) {
        console.error("Error fetching years:", error);
      }
    };

    fetchYears();
  }, []);

  // Fetch Categories based on selected year
  const fetchCategories = async () => {
    try {
      if (selectedYear) {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(
          votingContract.abi,
          contractAddress
        );

        const fetchedCategories = await contract.methods
          .getCategoriesInYear(selectedYear)
          .call();

        // Map the categories and set the first one as the default selected category
        const mappedCategories = fetchedCategories.map((cat) => ({
          label: cat.categoryName,
          value: Number(cat.categoryId),
        }));

        setCategories(mappedCategories);

        // Set the default selected category to the first one
        if (mappedCategories.length > 0) {
          setSelectedCategory(mappedCategories[0].value);
        }

        console.log(fetchedCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [selectedYear]);

  useEffect(() => {
    // Update Data Points based on the selected category and year
    const updateDataPoints = async () => {
      if (selectedCategory && selectedYear) {
        try {
          const web3 = new Web3(window.ethereum);
          const contract = new web3.eth.Contract(
            votingContract.abi,
            contractAddress
          );

          // Fetch event IDs and vote counts using getPositionVotes
          const result = await contract.methods
            .getPositionVotes(selectedCategory, selectedYear)
            .call();

          console.log("getPositionVotes result:", result);

          const eventIds = result[0];
          const voteCounts = result[1];

          console.log("eventIds:", eventIds);
          console.log("voteCounts:", voteCounts);

          // Fetch event data for each event ID
          const eventData = await Promise.all(
            eventIds.map(async (eventId) => {
              // Fetch event data for each event ID
              const event = await contract.methods
                .getEventById(selectedCategory, eventId)
                .call();

              // Map the event data to its corresponding vote count
              const voteCount = parseInt(
                voteCounts[eventIds.indexOf(eventId)],
                10
              );

              return {
                label: event.eventName,
                y: voteCount,
              };
            })
          );

          console.log("eventData:", eventData);

          // Update data points
          setDataPoints(eventData);
        } catch (error) {
          console.error("Error updating data points:", error);
        }
      } else {
        setDataPoints([]); // Clear the chart if no category or year is selected
      }
    };

    updateDataPoints();
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
      text: `${selectedYear}  -  Total Vote Counts (Event)`,
    },
    axisX: {
      title: "Events",
    },
    axisY: {
      title: "Number of Votes",
      minimum: 0,
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

      {selectedCategory && <CanvasJSChart options={options} />}
    </div>
  );
};

export default EventVoteChart;
