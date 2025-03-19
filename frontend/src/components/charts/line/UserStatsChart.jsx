import React from "react";
import { useTheme, Box, Typography } from "@mui/material";
import { ResponsiveLine } from "@nivo/line";
import { tokens } from "../../../theme";

const UserStatsChart = ({ data }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (!data || data.length === 0)
    return <Typography>No data available</Typography>;

  const formattedData = [
    {
      id: "Number of Users",
      data: data.map((stat) => ({
        x: stat.month,
        y: stat.count,
      })),
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
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
        Number of Users by Month
      </Typography>
      <Box
        sx={{
          width: "100%",
          height: "200px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ResponsiveLine
          data={formattedData}
          margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
          xScale={{ type: "point" }}
          yScale={{
            type: "linear",
            min: 0,
            max: "auto",
            stacked: false,
            reverse: false,
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: "bottom",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Month",
            legendOffset: 36,
            legendPosition: "middle",
          }}
          axisLeft={{
            orient: "left",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Number of Users",
            legendOffset: -40,
            legendPosition: "middle",
          }}
          enablePoints={false}
          enableArea={true}
          areaOpacity={0.1}
          useMesh={true}
          legends={[
            {
              anchor: "bottom",
              direction: "row",
              justify: false,
              translateX: 0,
              translateY: 56,
              itemsSpacing: 0,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.85,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
          theme={{
            text: {
              fill: "black",
              fontSize: 12,
            },
            axis: {
              domain: {
                line: {
                  stroke: "black",
                },
              },
              legend: {
                text: {
                  fill: "black",
                },
              },
              ticks: {
                line: {
                  stroke: "black",
                  strokeWidth: 1,
                },
                text: {
                  fill: "black",
                },
              },
            },
            legends: {
              text: {
                fill: "black",
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default UserStatsChart;
