import React from "react";
import { useTheme } from "@mui/material";
import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../../../theme"; // Adjust the import path as necessary

const SubscriptionChart = ({ data }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (!data || data.length === 0) {
    console.log("No subscription data available.");
    return <p>No data available</p>;
  }

  // Log the data to verify structure
  console.log("Subscription data:", data);

  // Prepare data for Nivo
  const chartData = data.map(d => ({
    id: d.type,
    label: d.type,
    value: Number(d.count) || 0, // Ensure this is a number
  }));

  return (
    <div style={{ height: 400 }}>
      <h2>Subscription Types</h2>
      <ResponsivePie
        data={chartData}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        colors={{ scheme: 'nivo' }} // Use a simple color scheme
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
        enableArcLabels={true}
        arcLabel={(e) => `${e.id}: ${e.value}`}
        enableArcLinkLabels={false}
        tooltip={(e) => (
          <strong>
            {e.id}: {e.value}
          </strong>
        )}
      />
    </div>
  );
};

export default SubscriptionChart;