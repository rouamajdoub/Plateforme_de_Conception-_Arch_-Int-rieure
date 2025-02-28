import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const SubscriptionChart = ({ data }) => {
  if (!data || data.length === 0) return <p>No data available</p>;

  const chartData = {
    labels: data.map(d => d.type),
    datasets: [
      {
        data: data.map(d => d.count),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF4364", "#2592EB", "#FFC336"],
      },
    ],
  };

  return (
    <div>
      <h2>Subscription Types</h2>
      <Pie data={chartData} options={{ responsive: true }} />
    </div>
  );
};

export default SubscriptionChart;
