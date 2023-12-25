import React, { useState, useEffect } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import Web3 from "web3";
import votingContract from "../../../build/contracts/VotingSystem.json";
import { contractAddress } from "../../../config";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
      const fetchedEvents = await contract.methods.getAllEvent().call();

      const validEvents = fetchedEvents.filter(
        (event) => Number(event.startDateTime) !== 0
      ); // Filter out events with a timestamp of 0
      const years = new Set(
        validEvents.map((event) =>
          new Date(Number(event.startDateTime) * 1000).getFullYear()
        )
      );
      const sortedYears = Array.from(years).sort((a, b) => b - a);
      setAvailableYears(sortedYears);

      if (sortedYears.length > 0) {
        setSelectedYear(sortedYears[0].toString());
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const updateCategories = async () => {
      if (selectedYear) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const contract = new web3.eth.Contract(
          votingContract.abi,
          contractAddress
        );

        const fetchedEvents = await contract.methods.getAllEvent().call();
        const categoryIds = new Set(
          fetchedEvents
            .filter(
              (event) =>
                new Date(Number(event.startDateTime) * 1000)
                  .getFullYear()
                  .toString() === selectedYear
            )
            .map((event) => Number(event.categoryId))
        );

        const categoryOptions = await Promise.all(
          Array.from(categoryIds).map(async (categoryId) => {
            const category = await contract.methods
              .getCategoryById(categoryId)
              .call();
            return { label: category.categoryName, value: categoryId };
          })
        );

        setCategories(categoryOptions);

        if (categoryOptions.length > 0) {
          setSelectedCategory(categoryOptions[0].value.toString());
        } else {
          setSelectedCategory("");
        }
      }
    };

    updateCategories();
  }, [selectedYear]);

  useEffect(() => {
    const fetchDataPoints = async () => {
      if (selectedCategory && selectedYear) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const contract = new web3.eth.Contract(
          votingContract.abi,
          contractAddress
        );

        const categoryEvents = await contract.methods
          .getAllCategoryEvent(selectedCategory)
          .call();
        const filteredEvents = categoryEvents.filter(
          (event) =>
            new Date(Number(event.startDateTime) * 1000)
              .getFullYear()
              .toString() === selectedYear
        );

        const voteData = await Promise.all(
          filteredEvents.map(async (event) => {
            const candidates = await contract.methods
              .getAllCandidatesInEvent(selectedCategory, event.eventId)
              .call();
            const totalVotes = candidates.reduce(
              (sum, candidate) => sum + Number(candidate.voteCount),
              0
            );
            return { label: event.eventName, y: totalVotes };
          })
        );

        setDataPoints(voteData);
      }
    };

    fetchDataPoints();
  }, [selectedYear, selectedCategory]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
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

  // Function to find the label of the selected category
  const getSelectedCategoryLabel = () => {
    const selectedCat = categories.find(
      (cat) => cat.value.toString() === selectedCategory
    );
    return selectedCat ? selectedCat.label : "Unknown Category";
  };

  const options = {
    animationEnabled: true,
    title: {
      text: `${selectedYear} - Total Vote Counts of Positions (${getSelectedCategoryLabel()})`,
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

export default PositionChart;
