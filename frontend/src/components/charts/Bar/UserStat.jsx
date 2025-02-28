import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserStat = ({ data }) => {
  if (!data || data.length === 0) return <p>Chargement des données...</p>;

  // Compter le nombre d'utilisateurs par rôle
  const roleCounts = data.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(roleCounts);
  const values = Object.values(roleCounts);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Nombre d'utilisateurs",
        data: values,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Répartition des Utilisateurs par Rôle" },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default UserStat;
