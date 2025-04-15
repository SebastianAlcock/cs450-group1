import { Component } from 'react';
import * as d3 from 'd3';
import './Styles/Visualization3.css';

const parseBloodPressure = (d) => {
  const [systolic, diastolic] = d.split('/').map(Number);
  return { systolic, diastolic };
};

class Visualization3 extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedFilter: 'All',
    };
  }

  componentDidMount() {
    this.createVisualization(this.props.data);
  };

  componentDidUpdate() {
    this.createVisualization(this.props.data);
  };

  createVisualization = (data) => {
    //--data filtering--
    const { selectedFilter } = this.state;
    if (selectedFilter !== 'All'){
      if (selectedFilter === 'Male' || selectedFilter === 'Female'){
        data = data.filter(d => d.Gender === selectedFilter);
      }
      else{
        data = data.filter(d => d.SleepDisorder === selectedFilter);
      }
    }

    //--chart--
    const margin = { top: 40, right: 150, bottom: 40, left: 60 };
    const width = 1000;
    const height = 400;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const xScale = d3.scaleLinear()
    .domain([
      d3.min(data, d => d['Age'] - 1), 
      d3.max(data, d => d['Age'])])
    .range([0, innerWidth - 50]);

    const yScale = d3.scaleLinear()
    .domain([
      d3.min(data, d => parseBloodPressure(d['BloodPressure']).systolic - 5),
      d3.max(data, d => parseBloodPressure(d['BloodPressure']).systolic + 5)
    ])
    .range([innerHeight, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    const svg = d3.select(".Visualization3")
    .attr("width", width)
    .attr("height", height);
    
    const innerChart = svg.select(".inner_chart").attr("transform", `translate(${margin.left}, ${margin.top})`);

    innerChart
      .selectAll(".x-axis")
      .data([null]) 
      .join("g")
      .attr('class','x-axis') 
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(xAxis)
      .selectAll("text")
      .style("font-size", "12px");;

    innerChart
      .selectAll(".y-axis")
      .data([null]) 
      .join("g")
      .attr('class','y-axis') 
      .call(yAxis)
      .selectAll("text")
      .style("font-size", "12px");;

    const shapeScale = d3.scaleOrdinal()
    .domain(["Male", "Female"])
    .range([d3.symbolCircle, d3.symbolSquare]); //male circle, female square

    const sleepDisorderColorScale = d3.scaleOrdinal()
    .domain(["Insomnia", "Sleep Apnea", "None"])
    .range(["#e41a1c", "#377eb8", "#4daf4a"]);

    //--plot points--
    innerChart
      .selectAll(".data-point")
      .data(data)
      .join("path")
      .attr("class", "data-point")
      .attr("transform", d => `translate(${xScale(d['Age'])}, ${yScale(parseBloodPressure(d['BloodPressure']).systolic)})`)
      .attr("d", d3.symbol().type(d => shapeScale(d['Gender'])).size(80))
      .attr("fill", d => sleepDisorderColorScale(d['SleepDisorder']));
    
    //--legends--
    const legend = svg.select(".legend").attr("transform", `translate(${width - margin.right + 60}, ${margin.top})`);

    legend.selectAll('.legend-bg')
      .data([null])
      .join('rect')
      .attr('class', 'legend-bg')
      .attr('x', -60)
      .attr('y', -20)
      .attr('width', 140)
      .attr('height', 170)
      .attr('fill', 'white')
      .attr('stroke', 'black')
      .attr('stroke-width', '1');

    legend
      .selectAll('.legend-gender-label')
      .data([null])
      .join('text')
      .attr('class', 'legend-gender-label')
      .attr('fill', 'black')
      .attr('x', -50)
      .attr('y', 0)
      .text('Gender:')
      .style('font-size', '15px');

    legend
      .selectAll('.legend-sleep-label')
      .data([null])
      .join('text')
      .attr('class', 'legend-sleep-label')
      .attr('fill', 'black')
      .attr('x', -50)
      .attr('y', 75)
      .text('Sleep Disorders:')
      .style('font-size', '15px');

    //gender legend
    const genderLegend = legend
      .selectAll(".gender-legend")
      .data(["Male", "Female"])
      .join("g")
      .attr("class", "gender-legend")
      .attr("transform", (d, i) => `translate(-30, ${i * 20 + 15})`);
    
    genderLegend
      .selectAll(".gender-legend-path")
      .data(d => [d])
      .join("path")
      .attr("class", "gender-legend-path")
      .attr("d", d3.symbol()
        .type(d => shapeScale(d))
        .size(70)
      )
      .attr("fill", "#000");
    
    genderLegend
      .selectAll(".gender-legend-text")
      .data(d => [d])
      .join("text")
      .attr("class", "gender-legend-text")
      .attr("x", 12)
      .attr("y", 5)
      .text(d => d)
      .style("font-size", "15px");

    //sleep disorders legend
    const sleepLegend = legend.selectAll(".sleep-legend")
      .data(["Insomnia", "Sleep Apnea", "None"])
      .join("g")
      .attr("class", "sleep-legend")
      .attr("transform", (d, i) => `translate(-30, ${i * 20 + 90})`);
    
    var triangle = d3.symbol().type(d3.symbolTriangle).size(50);
    
    sleepLegend
      .selectAll(".sleep-legend-path")
      .data(d => [d])
      .join("path")
      .attr("class", "sleep-legend-path")
      .attr("d", triangle)
      .attr("fill", d => sleepDisorderColorScale(d));
    
    sleepLegend
      .selectAll(".sleep-legend-text")
      .data(d => [d])
      .join("text")
      .attr("class", "sleep-legend-text")
      .attr("x", 16)
      .attr("y", 4)
      .text(d => d)
      .style("font-size", "15px");

    //--titles--
    svg
      .selectAll('.title-systolic')
      .data([null])
      .join('text')
      .attr('class', 'title-systolic')
      .attr('x', -height / 1.6)
      .attr('y', 15)
      .attr('transform', 'rotate(-90)')
      .text('Systolic Blood Pressure');

    svg
      .selectAll('.title-age')
      .data([null])
      .join('text')
      .attr('class', 'title-age')
      .attr('x', width / 2.2)
      .attr('y', height - 10)
      .attr('text-anchor', 'middle')
      .text('Age');

    svg
      .selectAll('.title-main')
      .data([null])
      .join('text')
      .attr('class', 'title-main')
      .attr('x', width / 2.2)
      .attr('y', height - 370)
      .attr('text-anchor', 'middle')
      .text('Blood Pressure by Age');
  }
  
  render() {
    return (
      <div style={{ position: 'relative' }}>
        <svg className="Visualization3">
            <g className="inner_chart"></g>
            <g className="legend"></g>
        </svg>
        <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
          <label>Filter: </label>
          <select
            value={this.state.selectedFilter}
            onChange={(e) => this.setState({ selectedFilter: e.target.value })}>
            <option value="All">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Insomnia">Insomnia</option>
            <option value="Sleep Apnea">Sleep Apnea</option>
            <option value="None">No Disorder</option>
          </select>
        </div>
      </div>
    );
  }
}

export default Visualization3;
