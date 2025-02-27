import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const D3UserStatistics = ({ data }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const validData = data.filter((d) => d.count != null && !isNaN(d.count));

    const x = d3
      .scaleBand()
      .domain(validData.map((d) => d.date))
      .range([0, width])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(validData, (d) => d.count) || 1]) // Ensure max is at least 1
      .nice()
      .range([height, 0]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append("g").call(d3.axisLeft(y));

    svg
      .selectAll(".bar")
      .data(validData)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.date))
      .attr("y", (d) => y(d.count))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.count) || 0) // Avoid NaN heights
      .attr("fill", "steelblue");
  }, [data]);

  return (
    <div>
      <h2>User Registration Over Time</h2>
      <svg ref={chartRef}></svg>
    </div>
  );
};

export default D3UserStatistics;
