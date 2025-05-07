import { Component } from 'react';
import * as d3 from 'd3';

import './Styles/Visualization2.css';

class Visualization2 extends Component {
  dropdownPopulated = false;

  componentDidMount() {
    this.createVisualization(this.props.data);
  }

  componentDidUpdate() {
    this.createVisualization(this.props.data);
  }

  createVisualization = (rawData) => {
    if (!rawData || rawData.length === 0) return;

    const width = 800;
    const height = 320;
    const margin = { top: 40, right: 180, bottom: 80, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(".mysvg")
      .attr("width", width)
      .attr("height", height);

    svg.selectAll(".vis2-inner").remove();
    const g = svg.append("g")
      .attr("class", "vis2-inner")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear().range([0, innerWidth]);
    const yScale = d3.scaleLinear().range([innerHeight, 0]);
    const sizeScale = d3.scaleSqrt().range([3, 15]);
    const colorScale = d3.scaleOrdinal(d3.schemeSet2);

    let data = rawData.filter(d =>
      d["PhysicalActivityLevel"] &&
      d["HeartRate"] &&
      d["SleepQuality"] &&
      d["DailySteps"] &&
      d["BMICategory"]
    );

    data.forEach(d => {
      d["PhysicalActivityLevel"] = +d["PhysicalActivityLevel"];
      d["HeartRate"] = +d["HeartRate"];
      d["DailySteps"] = +d["DailySteps"];
      d["SleepQuality"] = +d["SleepQuality"];
    });

    if (!this.dropdownPopulated) {
      const uniqueBMI = Array.from(new Set(rawData.map(d => d["BMICategory"])));
      const bmiDropdown = d3.select("#bmiSelect");
      bmiDropdown.selectAll("option").remove();
      bmiDropdown.append("option").attr("value", "All").text("All");
      uniqueBMI.forEach(bmi => {
        bmiDropdown.append("option").attr("value", bmi).text(bmi);
      });
      this.dropdownPopulated = true;
    }

    xScale.domain([d3.min(data, d => d["PhysicalActivityLevel"]) * 0.9, d3.max(data, d => d["PhysicalActivityLevel"]) * 1.05]);
    yScale.domain([d3.min(data, d => d["HeartRate"]) * 0.96, d3.max(data, d => d["HeartRate"])]);
    sizeScale.domain(d3.extent(data, d => d["DailySteps"]));
    colorScale.domain([...new Set(data.map(d => d["SleepQuality"]))]);

    g.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale));

    g.append("text")
      .text("Physical Activity Level")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 40)
      .style("text-anchor", "middle");

    g.append("g").call(d3.axisLeft(yScale));

    g.append("text")
      .text("Heart Rate")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -50)
      .style("text-anchor", "middle");

    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("padding", "6px 10px")
      .style("background", "#fff")
      .style("border", "1px solid #aaa")
      .style("border-radius", "6px")
      .style("pointer-events", "none")
      .style("font-size", "13px")
      .style("display", "none");

    const points = g.selectAll(".vis2-circle")
      .data(data, d => d["Person ID"]);

    points.join(
      enter => enter.append("circle")
        .attr("class", "vis2-circle")
        .attr("cx", d => xScale(d["PhysicalActivityLevel"]))
        .attr("cy", d => yScale(d["HeartRate"]))
        .attr("r", d => sizeScale(d["DailySteps"]))
        .attr("fill", d => colorScale(d["SleepQuality"]))
        .attr("opacity", 0.75)
        .on("mouseover", function (event, d) {
          tooltip.style("display", "block").html(`
            <strong>${d.Occupation}</strong><br>
            Sleep Quality: ${d["SleepQuality"]}<br>
            Steps: ${d["DailySteps"]}<br>
            BMI: ${d["BMICategory"]}`);
        })
        .on("mousemove", function (event) {
          tooltip
            .style("left", (event.pageX + 15) + "px")
            .style("top", (event.pageY - 25) + "px");
        })
        .on("mouseout", function () {
          tooltip.style("display", "none");
        })
    );

    svg.selectAll(".legend-vis2").remove();
    const legend = svg.append("g")
      .attr("class", "legend-vis2")
      .attr("transform", `translate(${margin.left + innerWidth + 10},${margin.top})`);

    legend.append("text")
      .text("Sleep Quality")
      .style("font-weight", "bold")
      .attr("y", -10);

    legend.append("text")
      .text("(1 = Poor, 9 = Excellent)")
      .style("font-size", "16px")
      .attr("y", 10);

    const uniqueSorted = [...new Set(colorScale.domain())].sort((a, b) => a - b);
    const legendRow = legend.selectAll(".legend-row")
      .data(uniqueSorted)
      .join("g")
      .attr("class", "legend-row")
      .attr("transform", (d, i) => `translate(0, ${i * 25 + 30})`);

    legendRow.append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", d => colorScale(d));

    legendRow.append("text")
      .attr("x", 24)
      .attr("y", 14)
      .text(d => d);

    legend.append("text")
      .attr("y", uniqueSorted.length * 25 + 60)
      .attr("font-size", "12px")
      .attr("fill", "#555")
      .text("Circle size = DailySteps");

    d3.select("#bmiSelect").on("change", () => this.update());
    d3.select("#activitySlider").on("input", () => this.update());
  };

  update() {
    if (!this.props || !this.props.data || this.props.data.length === 0) return;

    const selectedBMI = d3.select("#bmiSelect").property("value");
    const activityMax = +d3.select("#activitySlider").property("value");
    d3.select("#activityValue").text(activityMax);

    let data = this.props.data.filter(d =>
      d["PhysicalActivityLevel"] &&
      d["HeartRate"] &&
      d["SleepQuality"] &&
      d["DailySteps"] &&
      d["BMICategory"]
    );

    data.forEach(d => {
      d["PhysicalActivityLevel"] = +d["PhysicalActivityLevel"];
      d["HeartRate"] = +d["HeartRate"];
      d["DailySteps"] = +d["DailySteps"];
      d["SleepQuality"] = +d["SleepQuality"];
    });

    const filtered = data.filter(d =>
      (selectedBMI === "All" || d["BMICategory"] === selectedBMI) &&
      d["PhysicalActivityLevel"] <= activityMax
    );

    this.createVisualization(filtered);
  }

  render() {
    return (
      <div className='Visualization2'>
        Sleep Quality vs Physical Activity vs HeartRate
        <div id="controls">
          <label htmlFor="bmiSelect">Filter BMI Category: </label>
          <select id="bmiSelect"></select>

          <label htmlFor="activitySlider">Activity ≤ </label>
          <input type="range" id="activitySlider" min="0" max="100" defaultValue="100"></input>
          <span id="activityValue">100</span>
        </div>

        <svg className="mysvg">
          <g></g>
        </svg>
      </div>
    );
  }
}

export default Visualization2;
