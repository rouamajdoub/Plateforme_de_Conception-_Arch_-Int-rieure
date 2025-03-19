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
    <Box
      sx={{
        width: "100%", // Take up full width of the parent container
         // Take up full height of the parent container
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
              }}
            >
              <Typography variant="h4" gutterBottom sx={{ color: "black", fontWeight: "bold" }}>
          Most Popular Products by Reviews
              </Typography>
      <Box
        sx={{
          width: "100%",
          height: "200px", // Adjust height as needed
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ResponsiveBar
          data={chartData}
          keys={["count"]}
          indexBy="product"
          margin={{ top: 20, right: 20, bottom: 50, left: 50 }} // Adjust margins
          padding={0.3}
          colors={[colors.blueAccent[400]]}
          theme={{
            text: {
              fill: "black", // Set text color to black
              fontSize: 14,
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

export default ReviewChart;
