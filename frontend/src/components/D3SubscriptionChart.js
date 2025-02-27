import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const D3SubscriptionChart = ({ data }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const validData = data.filter(d => d.count != null && !isNaN(d.count)); // Ensure valid data

    const width = 500, height = 300;
    const radius = Math.min(width, height) / 2;

    d3.select(chartRef.current).selectAll("*").remove(); // Clear previous elements

    const svg = d3.select(chartRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie().value(d => d.count || 0); // Avoid NaN values
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    svg.selectAll("path")
      .data(pie(validData))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.type));
  }, [data]);

  return (
    <div>
      <h2>Subscription Types</h2>
      <svg ref={chartRef}></svg>
    </div>
  );
};

export default D3SubscriptionChart;
