// --------------------CHART SIZE PARAMETERS--------------------
// svg container size
var height = 600;
var width = 1000;

// set margins
var margin = {
   top: 50,
   right: 50,
   bottom: 50,
   left: 50
};

// set chart size inside svg area with margins all sides
var chartHeight = height - margin.top - margin.bottom
var chartWidth = width - margin.left - margin.right
// -------------------------------------------------------------

// create svg area
function createSvg() {
   var svg = d3.select("#scatter").append("svg")
      .attr("height", height)
      .attr("width", width)
   return svg
};

// create chart group
function createChart(svg) {
   chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
   return chartGroup
};

// set axes scale with numerical data to both axes
function numNumAxesScale (yData, xData) {
   var yScale = d3.scaleLinear()
      .domain([d3.min(yData) * 0.8, d3.max(yData) * 1.1])
      .range([chartHeight, 0]);

   var xScale = d3.scaleLinear()
      .domain([d3.min(xData) * 0.8, d3.max(xData) * 1.1])
      .range([0, chartWidth]);

   return axesScale ={
      "yScale": yScale,
      "xScale": xScale
   }    

};

// apply axes scale to x and y axes  
function scaleToAxes(axesScale) {

   var yAxis = d3.axisLeft(axesScale.yScale);
   var xAxis = d3.axisBottom(axesScale.xScale);

   return axes = {
      "yAxis": yAxis,
      "xAxis": xAxis
   };
};

// append axes to chart
function insertAxes(axes, chartGroup) {
   // x axis to bottom of chart
   chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(axes.xAxis);

   // y axis
   chartGroup.append("g")
      .call(axes.yAxis);
};

// append circles to chart
function scatterCircles(data, xData, yData, chartGroup, axesScale) {
   var scatterPoints = chartGroup.selectAll("g")
      .data(data)
   var g = scatterPoints
      .enter()
      .append("g")
      .attr("transform", d => `translate(${axesScale.xScale(d.income)},${axesScale.yScale(d.obesity)})`)

   g.append("circle")
      //.attr("cy", d => axesScale.yScale(d.obesity))
      //.attr("cx", d => axesScale.xScale(d.income))
      .attr("r", "10"):
      .attr("fill", "red")
      .
   return g
};

// append circle labels to chart
function circleLabels(g, data, axesScale) {
   g.append("text")
      //.attr("cx", d => axesScale.xScale(d.income))
      //.attr("cy", d => axesScale.yScale(d.obesity))
      .text(d => d.abbr)
};

// -------------------- CREATE SCATTERPLOT --------------------
function createScatterplot(healthData, obesity, income) {
   // insert svg area to hold chart to page
   var svg = createSvg();
   // append chart group to svg area
   var chartGroup = createChart(svg);
   // create scale functions
   var axesScale = numNumAxesScale(obesity, income);
   // create axis functions
   var axes = scaleToAxes(axesScale);
   // append axes to chart
   insertAxes(axes, chartGroup);
   // append scatter plot circles to chart
   // use income and obesity as x and y values
   var g = scatterCircles(healthData, income , obesity, chartGroup, axesScale)
   // add labels to scatterplot points
   circleLabels(g,healthData,axesScale)
};
// ------------------------------------------------------------

// read data
const dataPath = "assets/data/data.csv";
d3.csv(dataPath).then(healthData => {
   healthData.forEach(row => {
      row.poverty = +row.poverty
      row.age = +row.age
      row.income = +row.income
      row.obesity = +row.obesity
      row.smokers = +row.smokers
   })
   const states = healthData.map(column => column.state);
   const stateAbbr = healthData.map(column => column.abbr);
   const poverty = healthData.map(column => column.poverty);
   const age = healthData.map(column => column.age);
   const income = healthData.map(column => column.income);
   const obesity = healthData.map(column => column.obesity);
   const smokers = healthData.map(column => column.smokes);
   console.log("states: ", states);
   console.log("abbrv: ", stateAbbr);
   console.log("poverty: ", poverty);
   console.log("age: ", age);
   console.log("income: ", healthData.income);
   console.log("obesity: ", healthData.obesity);
   console.log("smokers: ", smokers);
   console.log("health data: ", healthData)

   createScatterplot(healthData, obesity, income);
});
