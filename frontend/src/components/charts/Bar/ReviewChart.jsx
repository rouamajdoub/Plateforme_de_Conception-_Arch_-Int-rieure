import React from "react";
import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../../../theme"; // Adjust the import path as necessary

const ReviewChart = ({ data }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (!data || data.length === 0) return <p>No data available</p>;

  // Prepare the data for Nivo
  const chartData = data.map(d => ({
    product: d.product,
    reviewCount: d.reviewCount,
  }));

  return (
    <div style={{ height: 400 }}>
      <h2>Reviews per Product</h2>
      <ResponsiveBar
        data={chartData}
        keys={["reviewCount"]}
        indexBy="product"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        colors={{ scheme: "orange_red" }}
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
          legend: "Product",
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Reviews",
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

export default ReviewChart;