import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const ReviewChart = ({ data }) => {
  if (!data || data.length === 0) return <p>No data available</p>;

  const chartData = {
    labels: data.map(d => d.product),
    datasets: [
      {
        label: "Reviews per Product",
        data: data.map(d => d.reviewCount),
        backgroundColor: "rgba(255, 165, 0, 0.7)", // Orange
        borderColor: "rgba(255, 165, 0, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2>Reviews per Product</h2>
      <Bar data={chartData} options={{ responsive: true }} />
    </div>
  );
};

export default ReviewChart;
