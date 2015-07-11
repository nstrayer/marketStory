var colors = ['rgb(141,211,199)','rgb(255,255,179)','rgb(190,186,218)','rgb(251,128,114)','rgb(128,177,211)','rgb(253,180,98)','rgb(179,222,105)','rgb(252,205,229)','rgb(217,217,217)','rgb(188,128,189)']
function highlight(state, onOff , col){

    if(onOff == "on"){

        //select Line
        d3.selectAll("line." + state)
            .moveToFront()
            .attr("stroke-width", 3)
            .attr("stroke", col)

        d3.select(".state." + state).classed("state--selected", true)

    } else {

        //select Line
        d3.selectAll("line." + state)
            .moveToFront()
            .attr("stroke-width", 1)
            .attr("stroke", color)

        console.log("unselected")
        d3.select(".state." + state).classed("state--selected", false)
    }

}

function hoverHighlight(state, onOff){

    if (d3.select(".state." + state).classed("state--selected") == false){
      if(onOff == "on"){
          //select Line
          d3.selectAll("line." + state)
              .moveToFront()
              .attr("stroke-width", 3)

          d3.select(".state." + state)
            .select("rect")
            .attr("x", -cellSize * 1.2 / 2)
            .attr("y", -cellSize * 1.2 / 2)
            .attr("width", cellSize * 1.2 - 1)
            .attr("height", cellSize * 1.2 - 1)

      } else {

          //select Line
          d3.selectAll("line." + state)
              .moveToFront()
              .attr("stroke-width", 1)

          d3.select(".state." + state)
            .moveToFront()
            .select("rect")
            .attr("x", -cellSize / 2)
            .attr("y", -cellSize / 2)
            .attr("width", cellSize - 1)
            .attr("height", cellSize - 1)
      }
    }
}
