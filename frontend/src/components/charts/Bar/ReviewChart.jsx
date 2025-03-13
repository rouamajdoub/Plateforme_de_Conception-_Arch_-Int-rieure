import React from "react";
import { useTheme, Box, Typography } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../../../theme";

const ReviewChart = ({ productReviews }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (!productReviews || productReviews.length === 0)
    return <Typography>Loading...</Typography>;

  // Aggregate product reviews count by productId
  const productCounts = productReviews.reduce((acc, review) => {
    const productId = review.productId;
    if (productId) {
      acc[productId] = (acc[productId] || 0) + 1;
    }
    return acc;
  }, {});

  // Prepare data for the bar chart
  const chartData = Object.keys(productCounts).map((productId) => ({
    product: productId,
    count: productCounts[productId],
  }));

  return (
    <Box height={400}>
      <Typography variant="h6" gutterBottom>
        Most Popular Products by Reviews
      </Typography>
      <ResponsiveBar
        data={chartData}
        keys={["count"]}
        indexBy="product"
        margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
        padding={0.3}
        colors={[colors.blueAccent[400]]}
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
          legend: "Product ID",
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Review Count",
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
    </Box>
  );
};

export default ReviewChart;
