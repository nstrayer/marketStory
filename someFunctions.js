var colors = ['rgb(141,211,199)','rgb(255,255,179)','rgb(190,186,218)','rgb(251,128,114)','rgb(128,177,211)','rgb(253,180,98)','rgb(179,222,105)','rgb(252,205,229)','rgb(217,217,217)','rgb(188,128,189)']
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
