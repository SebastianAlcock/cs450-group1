import { Component } from 'react';
import * as d3 from 'd3';

import './Styles/Visualization1.css';

class Visualization1 extends Component {
  componentDidMount() {
    this.createVisualization(this.props.data);
  };

  componentDidUpdate() {
    this.createVisualization(this.props.data);
  };

  createVisualization = (data) => {
    const occupations = data.map((d) => d.Occupation);
    const uniqueOccupations = [...new Set(occupations)];

    const stressLevels = data.map((d) => d.StressLevel)
    const uniqueStressLevels = [...new Set(stressLevels)].sort().reverse();
    const colorList = ['hsl(0, 60%, 60%)', 'hsl(20, 60%, 60%)', 'hsl(40, 60%, 60%)', 'hsl(60, 60%, 60%)', 'hsl(80, 60%, 60%)', 'hsl(100, 60%, 60%)']; 

    const processed_data = [];

    uniqueOccupations.forEach(o => {

      var avg = d3.mean(data.filter((d) => d.Occupation === o).map((d) => +d.SleepDuration));
      var interiorHeight = avg;

      uniqueStressLevels.forEach(s => {

        var stressLevelPercent = data.filter((d) => d.Occupation === o && d.StressLevel === s).length / data.filter((d) => d.Occupation === o).length
        var interiorHeightDifference = stressLevelPercent * avg

        if (stressLevelPercent) processed_data.push({
          occupation: o,
          avg: avg,
          stressLevel: s,
          stressLevelPercent: stressLevelPercent,
          y: interiorHeight
        })

        interiorHeight -= interiorHeightDifference;

      })
    });

    processed_data.sort(function(a, b){
      var x = a.avg; var y = b.avg;
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });

    const uniqueOccupationsOrdered = [...new Set(processed_data.map((d) => d.occupation))].reverse();
  
    console.log(processed_data)
  
    const margin = { top: 40, right: 150, bottom: 50, left: 60 };
    const width = 1000;
    const height = 400;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
  
    const svg = d3.select('.Visualization1').attr('width', width).attr('height', height);
  
    const innerChart = svg.select('.innerChart').attr('transform', `translate(${margin.left}, ${margin.top})`);

    const legend = svg.select('.legend').attr('transform', `translate(${margin.left}, ${margin.top})`);
  
    var xScale = d3.scaleBand().domain(uniqueOccupationsOrdered).range([0, innerWidth]).padding(0.2);
    var yScale = d3.scaleLinear().domain([d3.max(processed_data.map(d => d.avg)), 0]).range([0, innerHeight]);
    var cScale = d3.scaleOrdinal().domain(uniqueStressLevels).range(colorList);
    var lScale = d3.scaleBand().domain(colorList).range([0, innerHeight / 2]);
    var tScale = d3.scaleBand().domain(uniqueStressLevels).range([0, innerHeight / 2]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
  
    innerChart
      .selectAll('rect')
      .data(processed_data)
      .join('rect')
      .attr('width', xScale.bandwidth())
      .attr('height', d => innerHeight - yScale(d.avg * d.stressLevelPercent))
      .attr('fill', d => cScale(d.stressLevel))
      .attr('x', d => xScale(d.occupation))
      .attr('y', d => yScale(d.y));
  
    innerChart
      .selectAll('.x-axis')
      .data([null])
      .join('g')
      .attr('class','x-axis')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis);
  
    innerChart
      .selectAll('.y-axis')
      .data([null])
      .join('g')
      .attr('class','y-axis')
      .call(yAxis);
  
    innerChart
      .selectAll('.y-axis-label')
      .data([null])
      .join('text')
      .attr('class','y-axis-label')
      .attr("text-anchor", "middle")
      .attr('x', innerWidth/2)
      .attr('y', margin.top + innerHeight)
      .text('Occupation');
  
    innerChart
      .selectAll('.x-axis-label')
      .data([null])
      .join('text')
      .attr('class','x-axis-label')
      .attr("text-anchor", "middle")
      .attr('x', -innerHeight/2)
      .attr('y', -35)
      .attr("transform", "rotate(-90)")
      .text('Average Sleep Duration (Hours)');
  
    innerChart
      .selectAll('.title')
      .data([null])
      .join('text')
      .attr('class','title')
      .attr("text-anchor", "middle")
      .attr('x', innerWidth/2)
      .attr('y', -10)
      .text('Average Sleep Duration by Occupation');

    legend
      .selectAll('.legend-bg')
      .data([null])
      .join('rect')
      .attr('class','legend-bg')
      .attr("style", "outline: thin solid black")
      .attr('width', margin.left * 2)
      .attr('height', innerHeight / 2 + 40)
      .attr('x', innerWidth + margin.left / 4)
      .attr('y', -20)
      .attr('fill', 'white')
  
    legend
      .selectAll('.legend-title')
      .data([null])
      .join('text')
      .attr('class','legend-title')
      .attr('fill', 'black')
      .attr("text-anchor", "start")
      .attr('x', innerWidth + margin.left / 2)
      .attr('y', 0)
      .text('Stress Level:');
    
    legend
      .selectAll('.legend-text')
      .data(uniqueStressLevels)
      .join('text')
      .attr('class','legend-text')
      .attr('fill', 'black')
      .attr('x', innerWidth + margin.left * 1.6)
      .attr('y', d => tScale(d) + 30)
      .text(d => d);
    
    legend
      .selectAll('.legend-color')
      .data(colorList)
      .join('rect')
      .attr('class','legend-color')
      .attr('width', xScale.bandwidth)
      .attr('height', 20)
      .attr('x', innerWidth + margin.left / 2)
      .attr('y', d => lScale(d) + 15)
      .attr('fill', d => d)
    
  }
  
    render() {
      return (
        <svg className='Visualization1'>
          <g className='innerChart'></g>
          <g className='legend'></g>
        </svg>
      );
    }
}

export default Visualization1;
