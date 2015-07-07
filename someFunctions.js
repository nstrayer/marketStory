var colors = ['rgb(31,120,180)','rgb(51,160,44)','rgb(251,154,153)','rgb(227,26,28)','rgb(253,191,111)','rgb(255,127,0)','rgb(202,178,214)','rgb(106,61,154)','rgb(255,255,153)','rgb(177,89,40)']
function highlight(state, onOff , col){

    if(onOff == "on"){
        //select Point
        d3.selectAll("circle." + state)
            .moveToFront()
            .attr("fill", col)

        //select Line
        d3.selectAll("line." + state)
            .moveToFront()
            .attr("stroke-width", 3)
            .attr("stroke", col)
    } else {
        //select Point
        d3.selectAll("circle." + state)
            .moveToFront()
            .attr("fill", color)

        //select Line
        d3.selectAll("line." + state)
            .moveToFront()
            .attr("stroke-width", 1)
            .attr("stroke", color)
    }

}

function hoverHighlight(state, onOff, col){

    if(onOff == "on"){
        //select Point
        d3.selectAll("circle." + state)
            .moveToFront()
            .attr("fill", col)

        //select Line
        d3.selectAll("line." + state)
            .moveToFront()
            .attr("stroke-width", 3)
            .attr("stroke", col)
            .style("opacity","1")
    } else {
        //select Point
        d3.selectAll("circle." + state)
            .moveToFront()
            .attr("fill", color)

        //select Line
        d3.selectAll("line." + state)
            .moveToFront()
            .attr("stroke-width", 1)
            .attr("stroke", color)
            .style("opacity","0.5")
    }
}

function animatelines(step) {
    d3.selectAll("." + step).style("opacity","0.5");

    //Select All of the lines and process them one by one
    d3.selectAll("." + step)
    // .sort(function(a, b) {return d3.descending(a.numMarketsRank, b.numMarketsRank);})
    .transition().delay(function(d,i){return 50*i})
    .each(function(d,i){

    //for some reason .getTotalLength works for paths, but not plain lines.
    //Busting out some pythagorean theorem to get it done though.
    var yd = d3.select(this).attr("y2") - d3.select(this).attr("y1"),
        xd = d3.select(this).attr("x2") - d3.select(this).attr("x1"),
        totalLength = Math.sqrt(xd*xd + yd*yd);

	d3.select("#" + step + "_" + "line" + i).attr("stroke-dasharray", totalLength + " " + totalLength)
	  .attr("stroke-dashoffset", totalLength)
	  .transition()
	  .duration(1000)
	  .ease("linear")
	  .attr("stroke-dashoffset", 0)
    })
}
