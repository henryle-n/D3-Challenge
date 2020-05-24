// export data using d3 csv promise
d3.csv("assets/data/data.csv").then(function(data) {

    console.log(data);
  
    data.forEach(row => {
        row.poverty = +row.poverty;
        row.income = +row.income;
        row.healthcare = + row.healthcare;
    });

    // Step 1 Variables
// Set variables

    var svgWidth;
    var svgHeight;
    var margin;
    var width;
    var height;
    var svg;
    var chartGroup;

    var svgArea = d3.select("body").select("#scatter");
    if (!svgArea.empty()) {
    svgArea.remove();
    }

    svgWidth = window.innerWidth;;
    svgHeight = window.innerHeight;

    margin = {
    top: 50,
    right: 70,
    bottom: 90,
    left: 50
    };


    width = svgWidth - margin.left - margin.right;
    height = svgHeight - margin.top - margin.bottom;


    // Step 2: Create an SVG wrapper,
    // append an SVG group that will hold our chart,
    // and shift the latter by left and top margins.
    // =================================
    svg = d3
    .select("body").select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

    chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

}


  
    
  ).catch(function(error) {
    console.log(error);
  });