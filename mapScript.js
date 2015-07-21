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
    mHeight = $(window).height() * 0.7;

var mSvg = d3.select("#menu").append("svg")
    .attr("height", mHeight)
    .attr("width",  mWidth);

var gridWidth  = d3.max(states, function(d) { return d.x; }) + 1,
    gridHeight = d3.max(states, function(d) { return d.y; }) + 1,
    cellSize   = mWidth/ 13;

var state = mSvg.append("g")
    .attr("transform", "translate(" + mWidth / 2 + "," + mHeight / 2 + ")")
    // .attr("transform", "translate(" + mWidth / 2 + "," + mHeight / 2 + ") scale(1.2)")
  .selectAll(".state")
    .data(states)
  .enter().append("g")
    .attr("class", function(d) { return "state " + d.name; })
    .attr("transform", function(d) { return "translate(" + (d.x - gridWidth / 2) * cellSize + "," + (d.y - gridHeight / 2) * cellSize + ")"; })
    .on("click", function(d){
        if ($.inArray(d.name, selectedStates) == -1){ highlight(d.name, "on", colors[selectedStates.length % 11])
        } else { highlight(d.name, "off", "red") }
    })

state.append("rect")
    .attr("x", -cellSize / 2)
    .attr("y", -cellSize / 2)
    .attr("width", cellSize - 1)
    .attr("height", cellSize - 1)
    .attr("fill", "#dedede")
state.append("text")
    .attr("dy", ".35em")
    .text(function(d) { return d.name; });

//Let's make a mini menu for selecting groupings.
groupX = d3.scale.linear()
  .domain([0, groupings.length - 1])
  .range([cellSize*1.4, mWidth - cellSize*1.4 ])

groupY = d3.scale.linear()
  .domain([0, 2])
  .range([cellSize, mHeight/4])

mSvg.selectAll(".groupings")
  .data(groupings).enter()
  .append("text")
  .attr("class", "groupings")
  .attr("x", function(d,i){return groupX(i * .7)})
  .attr("y", function(d,i){return groupY(0.5)})
  .attr("font-size", "1.1em")
  .attr("text-anchor", "middle")
  .text(function(d){return d.group})
  .on("mouseover", function(d){ d3.select(this).attr("font-size", "1.3em") })
  .on("mouseout", function(d){
    if (!d3.select(this).classed("selected")){
      d3.select(this).attr("font-size", "1.1em")} })
  .on("click", function(d){
    if (!d3.select(this).classed("selected")){ //if it's not selected yet
      massHightlight(d.states)
      d3.selectAll(".groupings")
        .attr("font-size", "1.1em")
        .classed("selected", false) // deselect all others
      d3.select(this)
        .attr("font-size", "1.35em")
        .classed("selected", true)
    } else {
      massHightlight([])
      d3.selectAll(".groupings")
        .classed("selected", false)
    }});
