import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const D3ReviewManagementChart = ({ data }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const validData = data.filter(d => d.reviewCount != null && !isNaN(d.reviewCount)); // Ensure valid data

    const width = 500, height = 300;
    const svg = d3.select(chartRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove(); // Clear previous elements

    const x = d3.scaleBand()
      .domain(validData.map(d => d.product))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(validData, d => d.reviewCount) || 1]) // Prevent NaN values
      .nice()
      .range([height, 0]);

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append("g").call(d3.axisLeft(y));

    svg.selectAll(".bar")
      .data(validData)
      .enter()
      .append("rect")
      .attr("x", d => x(d.product))
      .attr("y", d => y(d.reviewCount))
      .attr("width", x.bandwidth())
      .attr("height", d => Math.max(height - y(d.reviewCount), 0)) // Ensure height is not NaN or negative
      .attr("fill", "orange");
  }, [data]);

  return (
    <div>
      <h2>Reviews per Product</h2>
      <svg ref={chartRef}></svg>
    </div>
  );
};

export default D3ReviewManagementChart;
