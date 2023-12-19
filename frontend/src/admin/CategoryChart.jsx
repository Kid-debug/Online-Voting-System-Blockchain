import React, { useState, useEffect } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import Web3 from "web3";
import votingContract from "../../../build/contracts/VotingSystem.json";
import { contractAddress } from "../../../config";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const CategoryChart = () => {
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [categories, setCategories] = useState([]);
  const [dataPoints, setDataPoints] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
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
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
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
          console.log(fetchedCategories);
          setCategories(
            fetchedCategories.map((cat) => ({
              label: cat.categoryName,
              value: cat.categoryId,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [selectedYear]);

  useEffect(() => {
    // This useEffect depends on the updated 'categories' state
    const updateDataPoints = async () => {
      try {
        if (selectedYear && categories.length > 0) {
          const web3 = new Web3(window.ethereum);
          const contract = new web3.eth.Contract(
            votingContract.abi,
            contractAddress
          );

          const votes = await Promise.all(
            categories.map((category) =>
              contract.methods
                .getCategoryYearlyVoteCount(category.value, selectedYear)
                .call()
            )
          );

          setDataPoints(
            categories.map((category, index) => ({
              label: category.label,
              y: parseInt(votes[index], 10),
            }))
          );
        }
      } catch (error) {
        console.error("Error updating data points:", error);
      }
    };

    updateDataPoints();
  }, [selectedYear, categories]);

  const options = {
    animationEnabled: true,
    title: {
      text: `${selectedYear} - Total Vote Counts (Category) `,
    },
    axisX: {
      title: "Categories",
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

  return (
    <div>
      <label htmlFor="year-select">Select Year: </label>
      <select
        id="year-select"
        value={selectedYear || ""}
        onChange={(e) => setSelectedYear(e.target.value)}
      >
        {availableYears.length > 0 ? (
          availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))
        ) : (
          <option value="">Loading years...</option>
        )}
      </select>

      {selectedYear && <CanvasJSChart options={options} />}
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
