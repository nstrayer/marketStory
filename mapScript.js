var states = [],
    selectedStates = [];
d3.select("#grid").text().split("\n").forEach(function(line, i) {
  var re = /\w+/g, m;
  while (m = re.exec(line)) states.push({
    name: m[0],
    selected: selectedStates.indexOf(m[0]) >= 0,
    x: m.index / 3,
    y: i
  });
});
var mWidth = parseInt(d3.select("#menu").style("width").slice(0, -2)),
    // mWidth = parseInt(d3.select("#menu").style("width").slice(0, -2)),
    mHeight = $(window).height() - 85;

var svg = d3.select("#menu").append("svg")
    .attr("height", mHeight)
    .attr("width", mWidth);
var gridWidth = d3.max(states, function(d) { return d.x; }) + 1,
    gridHeight = d3.max(states, function(d) { return d.y; }) + 1,
    cellSize = 40;
var state = svg.append("g")
    .attr("transform", "translate(" + mWidth / 2 + "," + mHeight / 2 + ")")
  .selectAll(".state")
    .data(states)
  .enter().append("g")
    .attr("class", function(d) { return "state" + (d.selected ? " state--selected" : ""); })
    .attr("transform", function(d) { return "translate(" + (d.x - gridWidth / 2) * cellSize + "," + (d.y - gridHeight / 2) * cellSize + ")"; })
    // .on("mouseover", function(d){d3.select(this).classed("state--selected", true)})
    .on("click", function(d){
        console.log(d)
        console.log(selectedStates)
        if ($.inArray(d.name, selectedStates) == -1){
            selectedStates.push(d.name)
            highlight(d.name, "on", "red")
            d3.select(this).classed("state--selected", true)
            console.log("Adding")
        } else {
            console.log("taking away")
            var index = selectedStates.indexOf(d.name)
            selectedStates.splice(index, 1)
            highlight(d.name, "off", "red")
            d3.select(this).classed("state--selected", false)
        }
    })
state.append("rect")
    .attr("x", -cellSize / 2)
    .attr("y", -cellSize / 2)
    .attr("width", cellSize - 1)
    .attr("height", cellSize - 1)
state.append("text")
    .attr("dy", ".35em")
    .text(function(d) { return d.name; });
