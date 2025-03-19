import React from "react";
import { useTheme, Box, Typography } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../../../theme"; // Adjust the import path as necessary

const UserStat = ({ data }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (!data || data.length === 0) return <Typography>Loading...</Typography>;

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
    <Box
      sx={{
        width: "100%", // Take up full width of the parent container
        height: "100%", // Take up full height of the parent container
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: "black", fontWeight: "bold" }}
      >
        User Distribution by Role
      </Typography>
      <Box
        sx={{
          width: "100%",
          height: "200px", // Adjusted height to fit the container
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ResponsiveBar
          data={chartData}
          keys={["count"]}
          indexBy="role"
          margin={{ top: 20, right: 20, bottom: 50, left: 50 }} // Adjusted margins
          padding={0.3}
          colors={["rgba(54, 162, 235, 0.6)"]} // Adjust the color later
          theme={{
            text: {
              fill: "black", // Set text color to black
              fontSize: 12,
            },
            axis: {
              domain: {
                line: {
                  stroke: "black", // Set axis line color to black
                },
              },
              legend: {
                text: {
                  fill: "black", // Set axis legend text color to black
                },
              },
              ticks: {
                line: {
                  stroke: "black", // Set axis tick line color to black
                  strokeWidth: 1,
                },
                text: {
                  fill: "black", // Set axis tick text color to black
                },
              },
            },
            legends: {
              text: {
                fill: "black", // Set legend text color to black
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
            <strong style={{ color: "black" }}>
              {id}: {value}
            </strong>
          )}
          enableLabel={false}
        />
      </Box>
    </Box>
  );
};

export default UserStat;
