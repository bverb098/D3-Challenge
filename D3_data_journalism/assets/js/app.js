//--------------------------------------------------------------
// CHART SIZE PARAMETERS
//--------------------------------------------------------------
// svg container size
var height = 800;
var width = 1200;

// set margins
var margin = {
   top: 120,
   right: 120,
   bottom: 120,
   left: 120
};

// set chart size inside svg area with margins all sides
var chartHeight = height - margin.top - margin.bottom
var chartWidth = width - margin.left - margin.right
//--------------------------------------------------------------


//--------------------------------------------------------------
// INITIAL VARIABLES/PARAMS
//--------------------------------------------------------------
var xAxisCount = 1
var yAxisCount = 1
//--------------------------------------------------------------


//--------------------------------------------------------------
// ALL FUNCTIONS
//      createSvg() - add svg to page
//      createChart() - add chart under svg
//      xAxisScale() - linear scale from selected data
//      yAxisScale() - linear scale from selected data
//      scaleXAxis() - apply xScale to d3 bottom axis
//      scaleYAxis() - apply yScale to d3 left axis
//      insertAxes() - append axes to chart
//      scatterPlot() - append circles with labels to chart
//      toolTip() - append tooltips to chart with mouse events
//      updateScatterX() - transition circles and axis on clicking axis label event
//      updateScatterY() - transition circles and axis on clicking axis label event
//      xLabelsGroup() - create group to hold x axis labels
//      yLabelsGroup() - create group to hold y axis labels
//      xLabel() - append x axis labels
//      yLabel() - append y axis labels
//--------------------------------------------------------------

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

// x axis linear scale 
function xAxisScale(data, chosenX) {
   var xScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenX]) * 0.8, d3.max(data, d => d[chosenX]) * 1.1])
      .range([0, chartWidth]);

   return xScale  
};

// y axis linear scale
function yAxisScale(data, chosenY) {
   var yScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenY]) * 0.8, d3.max(data, d => d[chosenY]) * 1.1])
      .range([chartHeight, 0]);

   return yScale
};

// apply scale to x axis
function scaleXAxis(xScale) {
   var bottomAxis = d3.axisBottom(xScale)
   
   return bottomAxis
};

// apply scale to y axis
function scaleYAxis(yScale) {
   var leftAxis = d3.axisLeft(yScale)
   
   return leftAxis
};

// append axes to chart
function insertAxes(bottomAxis, leftAxis, chartGroup) {
   // x axis to bottom of chart
   var xAxis = chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis);

   // y axis
   var yAxis = chartGroup.append("g")
      .call(leftAxis);

   var axes = {
      x: xAxis,
      y: yAxis
   };

   return axes
};

// append circles with labels to chart in the correct position
function scatterPlot(data, chosenX, chosenY, chartGroup, xScale, yScale) {
   //create a group for every point that will be plotted. A circle and text will be appended under the group
   var scatterPoints = chartGroup.selectAll("g points")
      .data(data)
      .enter()
      .append("g")

   // place a circle under each new group in the correct location
   var radius = 12
   var scatterCircles =scatterPoints.append("circle") 
      .attr("r", `${radius}`)
      .attr("cx", d => xScale(d[chosenX]))
      .attr("cy", d => yScale(d[chosenY]))
      .classed("stateCircle", true)
   // place text at same spot with some adjustment to make sure they are middle of circles
   var scatterLabels = scatterPoints.append("text")
      .text(d => `${d.abbr}`)
      .attr("x", d => xScale(d[chosenX]))
      .attr("y", d => yScale(d[chosenY]) + (radius/4))
      .attr("font-size", `${radius-2}`)
      .classed("stateText", true);


   scatter={
      circles: scatterCircles,
      labels: scatterLabels,
      r: radius
   };

   return scatter
     
};

// append tool tips to chart
function toolTip(scatter, chosenX, chosenY) {
   var xTxt;
   
   switch (chosenX) {
      case "poverty":
         xTxt = "%";
         break;
      case "age":
         xTxt = " (Years Median)";
         break;
      case "income":
         xTxt = " ($ Median)"
         break;
      default:
         console.log("switch error")
   };
   
   var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
         return (`${d.state}<br>${chosenX}: ${d[chosenY]}${xTxt}<br>${chosenY}: ${d[chosenY]}%`)
      })
   scatter.circles.call(toolTip)
   scatter.circles.on("mouseover", toolTip.show)
   scatter.circles.on("mouseout", toolTip.hide)
   scatter.labels.call(toolTip)
   scatter.labels.on("mouseover", toolTip.show)
   scatter.labels.on("mouseout", toolTip.hide)

   return toolTip

};

// update scatter plot circles and x axis on axis label click
function updateScatterX(scatter, xScale, chosenX, bottomAxis, axes, xLabelGroup, data) {
   // move circles to new coords
   scatter.circles.transition()
      .duration(1000)
      .attr("cx", d => xScale(d[chosenX]))
   // move text to new coords
   scatter.labels.transition()
      .duration(1000)
      .attr("x", d => xScale(d[chosenX]))
   // redraw x axis
   axes.x.transition()
      .duration(1000)
      .call(bottomAxis)
   // change axis label text to indicate which is selected
   xLabelGroup.selectAll("text")
      .classed("active", false)
      .classed("inactive", true)
   xLabelGroup.selectAll(`text[value = ${chosenX}]`)
      .classed("inactive", false)
      .classed("active", true)
            
};

// update scatter plot circles and y axis on axis label click
function updateScatterY(scatter, yScale, chosenY, leftAxis, axes, yLabelGroup, data) {
   scatter.circles.transition()
      .duration(1000)
      .attr("cy", d => yScale(d[chosenY]))
   scatter.labels.transition()
      .duration(1000)
      .attr("y", d => yScale(d[chosenY]) + (scatter.r/4))
   axes.y.transition()
      .duration(1000)
      .call(leftAxis)
   yLabelGroup.selectAll("text")
      .classed("active", false)
      .classed("inactive", true)
   yLabelGroup.selectAll(`text[value = ${chosenY}]`)
      .classed("inactive", false)
      .classed("active", true)
};

// increase counter. Not necessary
function increment(n) {
   n++;
   return n;
};

// group to hold x labels
function xLabelGroup(chartGroup) {
   var xLabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${chartWidth/2},${chartHeight+20})`)
      return xLabelsGroup
};

// group to hold y labels
function yLabelGroup(chartGroup) {
   var yLabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${chartWidth/2},${chartHeight+20})`)
      return yLabelsGroup
};

// append x labels
function xLabel(xLabelGroup, labelText, value) {
   
   // append x label
   var xLabel = xLabelGroup.append("text")
      .attr("x", 0)
      .attr("y",xAxisCount * 20)
      .attr("value", `${value}`)
      .text(`${labelText}`)
   if (xAxisCount == 1) {
      xLabel.classed("active", true)
   } else {
      xLabel.classed("inactive",true)
   };

   xAxisCount = increment(xAxisCount)
};

// append y labels
function yLabel(yLabelGroup, labelText, value) {
   // append y label
   var yLabel = yLabelGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", chartHeight/2) 
      .attr("y", -chartWidth/2 - 50 - (yAxisCount * 20))
      .attr("dy", "1em")
      .attr("value", `${value}`)
      .text(`${labelText}`)
      if (yAxisCount == 1) {
         yLabel.classed("active", true)
      } else {
         yLabel.classed("inactive",true)
      };
   
      yAxisCount = increment(yAxisCount)
};


//--------------------------------------------------------------
// CREATE SCATTERPLOT 
//--------------------------------------------------------------
function createScatterplot(healthData) {
   //------------------------------
   //CHART AREA ON PAGE
   //------------------------------
   // create svg 
   var svg = createSvg();
   // append chart group to svg area
   var chartGroup = createChart(svg);

   //------------------------------
   //AXES LABELS
   //------------------------------
   // insert labels group under chart group
   xLabelGroup = xLabelGroup(chartGroup);
   yLabelGroup = yLabelGroup(chartGroup);
   
   // choose text to append for each axis label
   const xPoverty = "In Poverty (%)";
   const xAge = "Age (Median)";
   const xIncome = "Household Income (Median)";
   const yHealthcare = "Lacks Healthcare (%)";
   const ySmokes = "Smokes (%)";
   const yObesity = "Obese (%)";

   // choose value for each axis label. to be used with event listener
   const vPoverty = "poverty";
   const vAge = "age";
   const vIncome = "income";
   const vHealthcare = "healthcare";
   const vSmokes = "smokes";
   const vObesity = "obesity";

   // pass text and values into functions to append axes labels to svg
   xLabel(xLabelGroup, xPoverty, vPoverty);
   xLabel(xLabelGroup, xAge, vAge);
   xLabel(xLabelGroup, xIncome, vIncome);
   yLabel(yLabelGroup, yHealthcare, vHealthcare);
   yLabel(yLabelGroup, ySmokes, vSmokes);
   yLabel(yLabelGroup, yObesity, vObesity);


   //------------------------------
   // INIT SCATTERPLOT ON DEFAULT AXES
   //------------------------------
   var chosenX = vPoverty;
   var chosenY = vHealthcare;

   var xScale = xAxisScale(healthData, chosenX);
   var yScale = yAxisScale(healthData, chosenY);

   var bottomAxis = scaleXAxis(xScale);
   var leftAxis = scaleYAxis(yScale);

   var axes = insertAxes(bottomAxis, leftAxis, chartGroup);

   var scatter = scatterPlot(healthData, chosenX, chosenY, chartGroup, xScale, yScale);
   toolTip(scatter, chosenX, chosenY) 
   
   //------------------------------
   //EVENT LISTENERS ON X AND Y AXES LABELS
   //------------------------------
   
   xLabelGroup.selectAll("text")
      .on("click", function() {
         // get value of selected axis
         var value = d3.select(this).attr("value"); 
         if (value !== chosenX) {
            chosenX = value;
            xScale = xAxisScale(healthData, chosenX)
            bottomAxis = scaleXAxis(xScale)
            updateScatterX(scatter, xScale, chosenX, bottomAxis , axes, xLabelGroup, healthData)
            toolTip(scatter, chosenX, chosenY)
      }
   });

   yLabelGroup.selectAll("text")
      .on("click", function() {
         // get value of selected axis
         var value = d3.select(this).attr("value"); 
         if (value !== chosenY) {
            chosenY = value;
            yScale = yAxisScale(healthData, chosenY)
            leftAxis = scaleYAxis(yScale)
            updateScatterY(scatter, yScale, chosenY, leftAxis, axes, yLabelGroup, healthData)
            toolTip(scatter, chosenX, chosenY)
      }
   });
};
// ------------------------------------------------------------


// ------------------------------------------------------------
// READ IN CSV DATA, CLEAN DATA, PASS DATA INTO SCATTERPLOT FUNC
// ------------------------------------------------------------
const dataPath = "assets/data/data.csv";
d3.csv(dataPath).then(healthData => {
   healthData.forEach(row => {
      row.poverty = +row.poverty
      row.age = +row.age
      row.income = +row.income
      row.healthcare = +row.healthcare
      row.obesity = +row.obesity
      row.smokes = +row.smokes
   })
   console.log("health data: ", healthData)

   createScatterplot(healthData);
});
