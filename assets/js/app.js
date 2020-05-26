// ========== DECLARE VARIABLES =================

var svgWidth;
var svgHeight;
var margin;
var width;
var height;
var svg;
var chartGroup;
var transDura = 800; // unit = ms

// ============== SVG CREATTION ==================
// get current user window size for svg scaling
svgWidth = window.innerWidth;;
svgHeight = window.innerHeight;

margin = {
  top: 70,
  right: 124,
  bottom: 70,
  left: 124
  };

width = svgWidth - margin.left - margin.right;
height = svgHeight - margin.top - margin.bottom;


// create svg wrapper 
var svgArea = d3.select("body").select("#scatter");

if (!svgArea.empty()) {
svgArea.remove();
}

svgArea
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight);

// shift the svg area to specified parameters
chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);


// initial chosen axes upon page loading
var chosenXaxis = "poverty";
var chosenYaxis = "healthcare";

// =============== SCALING AXES =================
function xScale(demoData, chosenXaxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    // scale so that min of the axis is 20% extended beyond original data
    // max is 20% more than original
    .domain([d3.min(demoData, d => d[chosenXaxis]) * 0.3,
      d3.max(demoData, d => d[chosenXaxis]) * 1.5
    ])
    .range([0, width]);
  return xLinearScale;
}

// function used for updating y-scale var upon click on yAxis label
function yScale(demoData, chosenYaxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    // scale so that min of the axis is 20% extended beyond original data
    // max is 20% more than original
    .domain([d3.min(demoData, d => d[chosenYaxis]) * 0.3,
      d3.max(demoData, d => d[chosenYaxis]) * 1.5
    ])
    .range([height, 0]);
  return yLinearScale;
}

// =============== UPDATING CURRENT AXES =================
function renderXaxes(newXscale, xAxis) {
  var bottomAxis = d3.axisBottom(newXscale);
  xAxis.transition()
    .duration(transDura)
    .call(bottomAxis);
  return xAxis;
}

function renderYaxes(newYscale, yAxis) {
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
    .attr("cx", d => newXscale(d[chosenXaxis]))
    .attr("cy", d => newYscale(d[chosenYaxis]));
  return circlesGroup;
}

//    row.poverty = +row.poverty;
// row.age = + row.age;
//       row.income = +row.income;
//       row.healthcare = + row.healthcare;
// row.smokes = + row.smokes;
//       row.obesity = + row.obesity;
//       
//       

// update tooltip for circles
function updateToolTip(chosenXaxis, chosenYaxis, circlesGroup) {

  var labelX;
  var labelY;
  switch (chosenXaxis) {
    case "poverty":
      labelX = "In Poverty (%)";
      break;
    
    case "age":
      labelX = "Age (Median)";
      break;

    case "income":
      labelX = "Household Income (Median)";
      break;
  }

  switch (chosenYaxis) {
    case "healthcare":
      labelY = "Lacks Healthcare (%)";
      break;
    
    case "smokes":
      labelY = "Smokes (%)";
      break;

    case "obesity":
      labelY = "Obesity (%)";
      break;
  }

  // if (chosenXAxis === "hair_length") {
  //   label = "Hair Length:";
  // }
  // else {
  //   label = "# of Albums:"; // label inside the tooltip, not axis label
  // }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(row) {
      return (`
        ${row['state']}<hr>
        ${labelX}: ${row[chosenXaxis]}<br>
        ${labelY}: ${row[chosenYaxis]}
      `);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(tTip) {
    toolTip.show(tTip);
  })
    // onmouseout event
    .on("mouseout", function(tTip, index) {
      toolTip.hide(tTip);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(demoData, err) {
  if (err) throw err;
  // this can be also written as 
  // if (err) {throw (err)};

  // parse data
  demoData.forEach(row => {
    row.poverty = +row.poverty;
    row.income = +row.income;
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
    .call(bottomAxis);

  var yAxis = chartGroup.append("g")
  .classed("y-axis", true)
  .call(leftAxis);


  // append and show y axis
  // chartGroup.append("g")
  //   .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(demoData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXaxis]))
    .attr("cx", d => yLinearScale(d[chosenYaxis]))
    .attr("r", 10)
    .attr("fill", "blue")
    .attr("opacity", ".8");

  // --------- Create group for 3 x-axis labels ------------
  var labelsGroupX = chartGroup.append("g")
  // position of the axis labels
    .attr("transform", `translate(${width / 2}, ${height + 17})`);

  // add text label to the labelsGroup
  var povLabel = labelsGroupX.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var ageLabel = labelsGroupX.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");
  
  var incomeLabel = labelsGroupX.append("text")
  .attr("x", 0)
  .attr("y", 60)
  .attr("value", "income") // value to grab for event listener
  .classed("inactive", true)
  .text("Household Income (Median)");

  // --------- Create group for 3 y-axis labels ------------
  // append y axis
  // chartGroup.append("text")
  //   .attr("transform", "rotate(-90)")
  //   .attr("y", 0 - margin.left) //
  //   .attr("x", 0 - (height / 2))
  //   .attr("dy", "2rem")
  //   .classed("axis-text", true)
  //   .text("Number of Billboard 500 Hits");
    // specify the spacing between different axis labels for both x & y

  var labelsGroupY = chartGroup.append("g")
    // rotate yAxis label CCW 90-deg
    .attr("transform", "rotate(-90)");
    
    // add text label to the labelsGroup
  var healthCareLabel = labelsGroupY.append("text")
    .attr("x", 0 - height / 2)
    .attr("y", 0)
    .attr("value", "healthCare") // value to grab for event listener
    .classed("active", true)
    .text("Lacks Healthcare (%)")
        //   .attr("y", 0 - margin.left) //
  //   .attr("x", 0 - (height / 2))
    .attr("dy", "2rem")
  //   .classed("axis-text", true)
  //   .text("Number of Billboard 500 Hits");
;
  
  var smokeLabel = labelsGroupY.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "smoke") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes (%)");
    
  var obesseLabel = labelsGroupY.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "obesse") // value to grab for event listener
    .classed("inactive", true)
    .text("Obesse (%)");


  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXaxis, chosenYaxis, circlesGroup)

  // x axis labels event listener
  labelsGroupX.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXaxis = value;

        console.log(chosenXaxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(demoData, chosenXaxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "num_albums") {
          albumsLabel
            .classed("active", true)
            .classed("inactive", false);
          hairLengthLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          albumsLabel
            .classed("active", false)
            .classed("inactive", true);
          hairLengthLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
}).catch(function(error) {
  console.log(error);
});




// export data using d3 csv promise
d3.csv("assets/data/data.csv").then(function(data) {

  console.log(data);

  data.forEach(row => {
      row.poverty = +row.poverty;
      row.income = +row.income;
      row.healthcare = + row.healthcare;
      row.obesity = + row.obesity;
      row.smokes = + row.smokes;
      row.age = + row.age;
  });






}).catch(function(error) {
    console.log(error);
  });