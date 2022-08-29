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

// create array of objects with data to pass into scatter plot
function combineData(xData, yData, abbr) {
   const combinedData = xData.map((x, i) => ({ x, y: yData[i], abbr: abbr[i]}));
   console.log("combined data: ", combinedData)
   return combinedData
};

// set axes scale with numerical data to both axes
function numNumAxesScale (xData, yData) {
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

// append circles with labels to chart in the correct position
function scatterCircles(combinedData, chartGroup, axesScale) {
   //create a group for every point that will be plotted. A circle and text will be appended under the group
   var scatterPoints = chartGroup.selectAll("g points")
      .data(combinedData)
      .enter()
      .append("g")

   // place a circle under each new group in the correct location
   var radius = 8
   var scatterCircles =scatterPoints.append("circle") 
      .attr("r", `${radius}`)
      .attr("cx", d => axesScale.xScale(d.x))
      .attr("cy", d => axesScale.yScale(d.y))
      .classed("stateCircle", true)

   // place text at same spot with some adjustment to make sure they are middle of circles
   var scatterLabels =scatterPoints.append("text")
      .text(d => `${d.abbr}`)
      .attr("x", d => axesScale.xScale(d.x))
      .attr("y", d => axesScale.yScale(d.y) + (radius/4))
      .attr("font-size", `${radius-2}`)
      .classed("stateText", true);
     
};

function axesLabels(chartGroup) {
   var labelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${chartWidth/2},${chartHeight+20})`)
   
   // append x labels
   var incomeLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .classed("aText", true)
      .text("income ($)")

   // append y label
   var obesityLabel = labelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", chartHeight/2) 
      .attr("y", -chartWidth/2 - margin.left)
      .attr("dy", "1em")
      .classed("aText", true)
      .text("rate of obesity (%)")
};
// -------------------- CREATE SCATTERPLOT --------------------
function createScatterplot(healthData, obesity, income, abbr) {
   // insert svg area to hold chart to page
   var svg = createSvg();
   // append chart group to svg area
   var chartGroup = createChart(svg);
   // choose x values, y values and labels (state abbrevs)
   var incomeObesity = combineData(income, obesity, abbr)
   // create scale functions
   var axesScale = numNumAxesScale(income, obesity);
   // create axis functions
   var axes = scaleToAxes(axesScale);
   // append axes to chart
   insertAxes(axes, chartGroup);
   // append scatter plot circles to chart
   scatterCircles(incomeObesity, chartGroup, axesScale)
   // append labels to axes
   axesLabels(chartGroup)
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
   console.log("income: ", income);
   console.log("obesity: ", obesity);
   console.log("smokers: ", smokers);
   console.log("health data: ", healthData)

   createScatterplot(healthData, obesity, income, stateAbbr);
});
