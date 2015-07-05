
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

function hoverHighlight(state, onOff){

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
