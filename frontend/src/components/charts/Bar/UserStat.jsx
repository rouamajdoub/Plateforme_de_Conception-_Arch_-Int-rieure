// UserStat.jsx
import React from "react";
import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../../../theme"; // Adjust the import path as necessary

const UserStat = ({ data }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (!data || data.length === 0) return <p>Loading...</p>;

  // Count the number of users by role
  const roleCounts = data.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(roleCounts).map((role) => ({
    role,
    count: roleCounts[role],
  }));

  return (
    <div style={{ height: 400 }}>
      <h2>User Distribution by Role</h2>
      <ResponsiveBar
        data={chartData}
        keys={["count"]}
        indexBy="role"
        margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
        padding={0.3}
        colors={["rgba(54, 162, 235, 0.6)"]} // I will adjust the color later
        theme={{
          axis: {
            domain: {
              line: {
                stroke: colors.grey[100],
              },
            },
            legend: {
              text: {
                fill: colors.grey[100],
              },
            },
            ticks: {
              line: {
                stroke: colors.grey[100],
                strokeWidth: 1,
              },
              text: {
                fill: colors.grey[100],
              },
            },
          },
          legends: {
            text: {
              fill: colors.grey[100],
            },
          },
        }}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Role",
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Number of Users",
          legendPosition: "middle",
          legendOffset: -40,
        }}
        tooltip={({ id, value }) => (
          <strong>
            {id}: {value}
          </strong>
        )}
        enableLabel={false}
      />
    </div>
  );
};

export default UserStat;