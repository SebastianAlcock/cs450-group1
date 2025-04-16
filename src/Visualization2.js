import { Component } from 'react';
import * as d3 from 'd3';

import './Styles/Visualization2.css';

class Visualization2 extends Component {

  componentDidMount() {
    this.createVisualization(this.props.data);
  };

  componentDidUpdate() {
    this.createVisualization(this.props.data);
  };

  createVisualization = (rawData) => {
    const width = 800;
    const height = 320;
    
    const svg = d3.select(".mysvg").attr('width', width).attr('height', height);

    const margin = { top: 40, right: 180, bottom: 80, left: 60 }; // Reduced left margin
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.selectAll("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear().range([0, innerWidth]);
    const yScale = d3.scaleLinear().range([innerHeight, 0]);
    const sizeScale = d3.scaleSqrt().range([3, 15]);
    const colorScale = d3.scaleOrdinal(d3.schemeSet2);

    var data = rawData
    
    data = data.filter(d =>
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

    const uniqueBMI = Array.from(new Set(data.map(d => d["BMICategory"])));
    const bmiDropdown = d3.select("#bmiSelect");

    uniqueBMI.forEach(bmi => {
      bmiDropdown.append("option").attr("value", bmi).text(bmi);
    });

    // Reduced padding to fit points closer to axes
    xScale.domain([d3.min(data, d => d["PhysicalActivityLevel"]) * 0.9, d3.max(data, d => d["PhysicalActivityLevel"]) * 1.05]);  // Minimal padding
    yScale.domain([d3.min(data, d => d["HeartRate"]) * 0.96, d3.max(data, d => d["HeartRate"])]);  // Minimal padding
    sizeScale.domain(d3.extent(data, d => d["DailySteps"]));
    colorScale.domain([...new Set(data.map(d => d["SleepQuality"]))]);

    // DRAW
    g.selectAll("*").remove();
    
    // Axes
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
  
    g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
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
          BMI: ${d["BMICategory"]}
        `);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", (event.pageX + 15) + "px")
          .style("top", (event.pageY - 25) + "px");
      })
      .on("mouseout", function () {
        tooltip.style("display", "none");
      });
    

    // DRAW LEGEND
    const legend = svg.append("g")
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
  
    uniqueSorted.forEach((q, i) => {
      const row = legend.append("g")
        .attr("transform", `translate(0, ${i * 25 + 30})`);
  
      row.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", colorScale(q));
  
      row.append("text")
        .attr("x", 24)
        .attr("y", 14)
        .text(`${q}`);
      });
    
    legend.append("text")
      .attr("y", uniqueSorted.length * 25 + 60)
      .attr("font-size", "12px")
      .attr("fill", "#555")
      .text("Circle size = DailySteps");

    d3.select("#bmiSelect").on("change", this.update);
    d3.select("#activitySlider").on("input", this.update);
  };

  update() {
    const selectedBMI = d3.select("#bmiSelect").property("value");
    const activityMax = +d3.select("#activitySlider").property("value");
    d3.select("#activityValue").text(activityMax);
  
    

    var data = this.props.data
    
    data = data.filter(d =>
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
      d["BMI Category"] === selectedBMI &&
      d["Physical Activity Level"] <= activityMax
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
          <input type="range" id="activitySlider" min="0" max="100" value="100"></input>
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