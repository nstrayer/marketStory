//just some nonsense to move objects to front easily.
d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

var height = 500,
    width = 800,
    padding = 10;

var svg = d3.select("#viz").append("svg")
    .attr("height", height)
    .attr("width", width)

//A counter variable to keep track of where we are in the visualization.
var count = 0

d3.csv("stateData.csv", function(data){
    //Quick! Clean up the import!
    data.forEach(function(d){
        d.Pop = +d.Pop
        d.numMarkets = +d.numMarkets
        d.popPerMarket = +d.popPerMarket
        d.gdpAg = +d.gdpAg
        d.gdpAll = +d.gdpAll
        d.gdpAll = +d.gdpAll
        d.percAg = +d.percAg
    })

    //We want to have the steps equaly spaced across the screen
    var x = d3.scale.ordinal()
        .domain(d3.range(3))
		.rangeRoundBands([0,width],0.2);

    //Set up scaling functions for each of the displayed statistics.
    //There is probably a more efficient way of doing this, but given that
    //both scales are called at the same time in the lines I couldn't think of one.

    var yNumMarkets = d3.scale.linear()
        .domain([0, d3.max(data, function(d){return d.numMarkets})])
        .range([height - padding, padding])

    var yPopPerMarket = d3.scale.linear()
        .domain([0, d3.max(data, function(d){return d.popPerMarket})])
        .range([padding, height - padding])

    var yPercAg = d3.scale.linear()
        .domain([0, d3.max(data, function(d){return d.percAg})])
        .range([height - padding, padding])

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", function(d){return d.abrev})
        .attr("cx", function(d,i){return x(count)})
        .attr("cy", function(d){return yNumMarkets(d.numMarkets)})
        .attr("r", 5)
        .attr("fill", "#2ca25f")
        .on("click", function(d){ changePosition() })

    //Start drawing the trend lines.
    //This is broken up into different steps because in order to animate the lines,
    //they must already be drawn. This also allows us to attach data to them.
    svg.selectAll(".step0")
        .data(data)
        .enter()
        .append("line")
        .attr("id", function(d,i){return "step0_line" + i})
        .attr("class", function(d,i) {return "line step0 " + d.abrev })
        .attr("x1", x(0) )     // x position of the first end of the line
        .attr("y1", function(d){return yNumMarkets(d.numMarkets)})      // y position of the first end of the line
        .attr("x2", x(1))     // x position of the second end of the line
        .attr("y2", function(d){return yPopPerMarket(d.popPerMarket)})    // y position of the second end of the line
        .attr("stroke", "#99d8c9")
        .attr("stroke-width", 1)
        .style("opacity",0);

    svg.selectAll(".step1")
        .data(data)
        .enter()
        .append("line")
        .attr("id", function(d,i){return "step1_line" + i})
        .attr("class", function(d,i) {return "line step1 " + d.abrev })
        .attr("x1", x(1))     // x position of the first end of the line
        .attr("y1", function(d){return yPopPerMarket(d.popPerMarket)})      // y position of the first end of the line
        .attr("x2", x(2))     // x position of the second end of the line
        .attr("y2", function(d){return yPercAg(d.percAg)})    // y position of the second end of the line
        .attr("stroke", "#99d8c9")
        .attr("stroke-width", 1)
        .style("opacity",0);


    // console.table(data) //A nice way to checkout out the data.

    //I put my functions down here.

    //Move the circle and animate the lines.
    var changePosition = function() {

        //start line animation.
        animatelines("step" + count)

        //use this to determine which scale to use.
        order = ["numMarkets", "popPerMarket", "percAg"]
        var key = order[count + 1]
        var last = order[count]

        if (key == "popPerMarket"){
            var scale = yPopPerMarket
        } else if (key == "percAg"){
            var scale = yPercAg
        }

        if (last == "numMarkets"){
            var lastScale = yNumMarkets
        } else if (last == "popPerMarket"){
            var lastScale = yPopPerMarket
        } else {
            var lastScale = yPercAg
        }

        svg.selectAll("circle")
            .transition()
            .duration(2500)
            .ease("linear")
            .attr("cy", function(d){return scale(d[key])})
            .attr("cx", function(d,i){return x(count+1)})

        //increment the counter up one to indicate we are onto the next step.
        count = count + 1
    }
})

function animatelines(step) {
    d3.selectAll("." + step).style("opacity","0.5");

    //Select All of the lines and process them one by one
    d3.selectAll("." + step).each(function(d,i){

    //for some reason .getTotalLength works for paths, but not plain lines.
    //Busting out some pythagorean theorem to get it done though.
    var yd = d3.select(this).attr("y2") - d3.select(this).attr("y1"),
        xd = d3.select(this).attr("x2") - d3.select(this).attr("x1"),
        totalLength = Math.sqrt(xd*xd + yd*yd);

	d3.select("#" + step + "_" + "line" + i).attr("stroke-dasharray", totalLength + " " + totalLength)
	  .attr("stroke-dashoffset", totalLength)
	  .transition()
	  .duration(2500)
	  .ease("linear")
	  .attr("stroke-dashoffset", 0)
    })
}

function highlight(state, step){
    //select Point
    d3.select("circle." + state)
        .moveToFront()
        .attr("fill", "red")

    //select Line
    d3.selectAll("line." + step + "." + state)
        .moveToFront()
        .attr("stroke-width", 3)
        .attr("stroke", "red")

}
