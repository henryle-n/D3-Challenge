// ========== DECLARE VARIABLES =================

var svgWidth;
var svgHeight;
var margin;
var width;
var height;
var svg;
var chartGroup;
var transDura = 800; // unit = ms :: transition Time between new data
var scaleMin = 15; // percentage ::  axis value extension beyond dataset min value 
var scaleMax = 10; // percentage ::  axis value extension beyond dataset max value

// specify label starting position relative to origin and spacing out between labels of the same axis
var labelStartPos = 2.2; // rem unit
var labelSpacing = 1.3; // rem unit

// circular datapoint radius
var circleRadius = 12;



// ============== SVG CREATTION ==================
// get current user window size for svg scaling
svgWidth = window.innerWidth;
svgHeight = window.innerHeight*3/4;

margin = {
  top: svgHeight*0.05,
  right: svgWidth*0.2,
  bottom: svgHeight*0.27,
  left: svgWidth*0.2
  };

width = svgWidth - margin.left - margin.right;
height = svgHeight - margin.top - margin.bottom;


// create svg wrapper 
var svgArea = d3.select("body").select("#scatter");

svgArea
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight)


// shift the svg area to specified parameters
chartGroup = d3.select("svg").append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);


// default axes upon page loading
var chosenXaxis = "poverty";
var chosenYaxis = "healthcare";

// =============== SCALING AXES =================
function xScale(demoData, chosenXaxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    // scale so that min of the axis is 20% extended beyond original data
    // max is 20% more than original
    .domain([
      d3.min(demoData, data => data[chosenXaxis]) * (1 - scaleMin/100),
      d3.max(demoData, data => data[chosenXaxis]) * (1 + scaleMax/100)
    ])
    .range([0, width]);
  return xLinearScale;
}

// function used for updating y-scale var upon click on yAxis label
function yScale(demoData, chosenYaxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([
      d3.min(demoData, data => data[chosenYaxis]) * (1 - scaleMin/100),
      d3.max(demoData, data => data[chosenYaxis]) * (1 + scaleMax/100 )
    ])
    .range([height, 0]);
  return yLinearScale;
}

// =============== UPDATING CURRENT AXES =================
function renderXaxis(newXscale, xAxis) {
  var bottomAxis = d3.axisBottom(newXscale);
  xAxis.transition()
    .duration(transDura)
    .call(bottomAxis);
  return xAxis;
}

function renderYaxis(newYscale, yAxis) {
  var leftAxis = d3.axisLeft(newYscale);
  yAxis.transition()
    .duration(transDura)
    .call(leftAxis);
  return yAxis;
}

// ================= RENDERING CIRCLES ===================

// create/ update circular data points on graph
function renderCircles(circlesGroup, newXscale, newYscale, chosenXaxis, chosenYaxis) {

  circlesGroup.transition()
    .duration(transDura)
    .attr("cx", data => newXscale(data[chosenXaxis]))
    .attr("cy", data => newYscale(data[chosenYaxis]));
  return circlesGroup;
}

// ================= RENDERING CIRC LABELS ===================

// create/ update circular data points on graph
function renderCirLabel(circLabelGroup, newXscale, newYscale, chosenXaxis, chosenYaxis) {

  circLabelGroup.transition()
    .duration(transDura)
    .attr("x", data => newXscale(data[chosenXaxis]))
    .attr("y", data => newYscale(data[chosenYaxis]));
  return circLabelGroup;
}


// ================= UPDATE TOOLTIPS ===================
function updateToolTip(chosenXaxis, chosenYaxis, elementGroup) {

  var labelX;
  var labelY;
  switch (chosenXaxis) {
    case "poverty":
      labelX = "Poverty";
      break;
    
    case "age":
      labelX = "Age";
      break;

    case "income":
      labelX = "Income";
      break;
  }

  switch (chosenYaxis) {
    case "healthcare":
      labelY = "Lacks Healthcare";
      break;
    
    case "smokes":
      labelY = "Smokes";
      break;

    case "obesity":
      labelY = "Obesity";
      break;
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([-10, 0])
    .html(function(row) {
      if (chosenXaxis === "income"){
        return (`
          ${row['state']}<br>
          -------------------------<br>
          ${labelX}: 
            <span style='color:#59DCE5'>
              $${Math.max(Math.round(row[chosenXaxis] * 100)/100).toFixed(2)}K
            </span>
            <br>

          ${labelY}: 
            <span style='color:#59DCE5'>
              ${row[chosenYaxis]}%
            </span>
        `);}
      else
        return (`
          ${row['state']}<br>
          -------------------------<br>
          ${labelX}:
          <span style="color:#59DCE5">
            ${row[chosenXaxis]}%
          </span>  
          <br>

          ${labelY}: 
          <span style="color:#59DCE5">
            ${row[chosenYaxis]}%
          </span>
        `);
    });

    elementGroup.call(toolTip);

    elementGroup.on("mouseover", function(tTip) {
    toolTip.show(tTip);
  })
    // onmouseout event
    .on("mouseout", function(tTip, index) {
      toolTip.hide(tTip);
    });

  return elementGroup;
}


// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(demoData, err) {
  if (err) throw err;
  // this can be also written as 
  // if (err) {throw (err)};

  // parse data
  demoData.forEach(row => {
    row.poverty = +row.poverty;
    row.income = +row.income/1000; // convert to $1K unit
    row.healthcare = + row.healthcare;
    row.obesity = + row.obesity;
    row.smokes = + row.smokes;
    row.age = + row.age;
  });

  //  x & y linear scale function 
  var xLinearScale = xScale(demoData, chosenXaxis);
  var yLinearScale = yScale(demoData, chosenYaxis);


  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append and show x & y axes
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .attr("stroke", "#179C82")
    .call(bottomAxis);

  var yAxis = chartGroup.append("g")
  .classed("y-axis", true)
  .attr("stroke", "#179C82")
  .call(leftAxis);

  // create initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(demoData)
    .enter()
    .append("circle")
    .attr("cx", data => xLinearScale(data[chosenXaxis]))
    .attr("cy", data => yLinearScale(data[chosenYaxis]))
    .attr("r", circleRadius)
    .attr("fill", "#a52875")
    .attr("opacity", ".5");

  // create initial circles
  var circLabelGroup = chartGroup.selectAll(".circLabel")
    .data(demoData)
    .enter()
    .append("text")
    .classed("circLabel", true)
    .attr("x", data => xLinearScale(data[chosenXaxis]))
    .attr("y", data => yLinearScale(data[chosenYaxis]))
    .attr("dy", 4)
    .text(data => data.abbr);


  // --------- Create group for 3 x-axis labels ------------
  var labelsGroupX = chartGroup.append("g")
  // position of the xAxis labels
    .attr("transform", `translate(${width / 2}, ${height})`);

    // add text label to the labelsGroup
    var povertyLabel = labelsGroupX.append("text")
      .attr("y", `${labelStartPos}rem`)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .text("In Poverty (%)");

    var ageLabel = labelsGroupX.append("text")
      .attr("y", `${labelStartPos + labelSpacing}rem`)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Age, yrs (Median)");
    
    var incomeLabel = labelsGroupX.append("text")
    .attr("y", `${labelStartPos + 2*labelSpacing}rem`)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income, $1K (Median)");

  // --------- Create group for 3 y-axis labels ------------
  var labelsGroupY = chartGroup.append("g")
    // rotate yAxis label CCW 90-deg and move the label origin to mid yAxis  
    .attr("transform", `rotate(-90) translate(${-height/2}, 0)`);
    
      // add text label to the labelsGroup
    var healthCareLabel = labelsGroupY.append("text")
      .attr("y", `${-labelStartPos}rem`)
      .attr("value", "healthcare") 
      // value to grab for event listener
      .classed("active", true)
      .text("Lacks Healthcare (%)");
    
    var smokesLabel = labelsGroupY.append("text")
      .attr("y", `${-labelStartPos - labelSpacing}rem`)
      .attr("value", "smokes") 
      // value to grab for event listener
      .classed("inactive", true)
      .text("Smokes (%)");
      
    var obesityLabel = labelsGroupY.append("text")
      .attr("y", `${-labelStartPos - 2*labelSpacing}rem`)
      .attr("value", "obesity") 
      // value to grab for event listener
      .classed("inactive", true)
      .text("Obesity (%)");


  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXaxis, chosenYaxis, circlesGroup);

  // updateToolTipState function above csv import
  var circLabelGroup = updateToolTip(chosenXaxis, chosenYaxis, circLabelGroup);
  

  // x axis labels event listener
  labelsGroupX.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      console.log("You clicked on :: ", this);
      if (value !== chosenXaxis) {

        // replaces chosenXaxis with value
        chosenXaxis = value;

        // updates x & y scale for new data
        xLinearScale = xScale(demoData, chosenXaxis);
        yLinearScale = yScale(demoData, chosenYaxis);

        // updates x axis with transition
        xAxis = renderXaxis(xLinearScale, xAxis);
        yAxis = renderYaxis(yLinearScale, yAxis);

        // updates circle labels with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXaxis, chosenYaxis);

        circLabelGroup = renderCirLabel(circLabelGroup, xLinearScale, yLinearScale, chosenXaxis, chosenYaxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXaxis, chosenYaxis, circlesGroup);

        circLabelGroup = updateToolTip(chosenXaxis, chosenYaxis, circLabelGroup);

        // changes classes to change css format for active and inactive xAxis labels
        switch (chosenXaxis) {
          case "poverty":
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
            povertyLabel
              .classed("active", true)
              .classed("inactive", false);
            break;
        
          case "age":
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
            break;
  
          default:
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", true)
              .classed("inactive", false);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            break;
          }
      }
    });

    labelsGroupY.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYaxis) {

        // replaces chosenXaxis with value
        chosenYaxis = value;

        // updates x & y scale for new data
        xLinearScale = xScale(demoData, chosenXaxis);
        yLinearScale = yScale(demoData, chosenYaxis);

        // updates x axis with transition
        xAxis = renderXaxis(xLinearScale, xAxis);
        yAxis = renderYaxis(yLinearScale, yAxis);

        // updates circles with new y values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXaxis, chosenYaxis);

        // updates circle labels with new y values
        circLabelGroup = renderCirLabel(circLabelGroup, xLinearScale, yLinearScale, chosenXaxis, chosenYaxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXaxis, chosenYaxis, circlesGroup);

        circLabelGroup = updateToolTip(chosenXaxis, chosenYaxis, circLabelGroup);

        // changes classes to change bold text
        switch (chosenYaxis){
          case "healthcare":
            healthCareLabel
              .classed("active", true)
              .classed("inactive", false);
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
            obesityLabel
              .classed("active", false)
              .classed("inactive", true);
            break;
        
          case "smokes":
            healthCareLabel
              .classed("active", false)
              .classed("inactive", true);
            obesityLabel
              .classed("active", false)
              .classed("inactive", true);
            smokesLabel
              .classed("active", true)
              .classed("inactive", false);
            break;

          default:
            healthCareLabel
              .classed("active", false)
              .classed("inactive", true);
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
            obesityLabel
              .classed("active", true)
              .classed("inactive", false);
            break;
        }
      }
    });
}).catch(function(error) {
  console.log(error);
});