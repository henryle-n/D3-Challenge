// Step 1 Variables
// Set variables

var svgWidth;
var svgHeight;
var margin;
var width;
var height;
var svg;
var chartGroup;
var transDura = 800; // unit = ms


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


// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
var svgArea = d3.select("body").select("#scatter");

if (!svgArea.empty()) {
svgArea.remove();
}

svgArea
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight);

chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);


// Initial Params
var chosenXaxis = "hair_length";
var chosenYaxis = 

// function used for updating x-scale var upon click on X_axis label
function xScale(hairData, chosenXaxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    // scale so that min of the axis is 20% extended beyond original data
    // max is 20% more than original
    .domain([d3.min(hairData, d => d[chosenXaxis]) * 0.3,
      d3.max(hairData, d => d[chosenXaxis]) * 1.5
    ])
    .range([0, width]);
  return xLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
    .duration(transDura)
    .call(bottomAxis);
  return xAxis;
}

// function used for updating circles group with a transition to
// new circles -- THIS IS ONLY FOR "X-AXIS"
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(transDura)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  var label;

  if (chosenXAxis === "hair_length") {
    label = "Hair Length:";
  }
  else {
    label = "# of Albums:"; // label inside the tooltip, not axis label
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d['rockband']}<hr>${label} ${d[chosenXAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("hairData.csv").then(function(hairData, err) {
  if (err) throw err;
  // this can be also written as 
  if (err) {throw (err)};

  // parse data
  hairData.forEach(function(data) {
    data.hair_length = +data.hair_length;
    data.num_hits = +data.num_hits;
    data.num_albums = +data.num_albums;
  });

  // xLinearScale function above csv import
  // xScale is function defined line # 32 
  var xLinearScale = xScale(hairData, chosenXAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(hairData, d => d.num_hits)])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

  // append and show x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);


  // append and show y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(hairData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.num_hits))
    .attr("r", 10)
    .attr("fill", "blue")
    .attr("opacity", ".8");

  // Create group for two x-axis labels
  var labelsGroup = chartGroup.append("g")
  // position of the axis labels
    .attr("transform", `translate(${width/2}, ${height + 17})`);
  // add text label to the labelsGroup
  var hairLengthLabel = labelsGroup.append("text")
    .attr("x", 00)
    .attr("y", 20)
    .attr("value", "hair_length") // value to grab for event listener
    .classed("active", true)
    .text("Hair Metal Ban Hair Length (inches)");

  var albumsLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "num_albums") // value to grab for event listener
    .classed("inactive", true)
    .text("# of Albums Released");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left) //
    .attr("x", 0 - (height / 2))
    .attr("dy", "2rem")
    .classed("axis-text", true)
    .text("Number of Billboard 500 Hits");

  // updateToolTip function above csv import
  //var circlesGroup = 
  updateToolTip(chosenXAxis, circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(hairData, chosenXAxis);

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