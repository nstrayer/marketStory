var colors = ['rgb(141,211,199)','rgb(190,186,218)','rgb(251,128,114)','rgb(128,177,211)','rgb(253,180,98)','rgb(179,222,105)','rgb(252,205,229)','rgb(188,128,189)']
function highlight(state, onOff , col){

    if(onOff == "on"){
        selectedStates.push(state)

        //select Line
        d3.selectAll("line." + state)
            .moveToFront()
            .attr("stroke-width", 3)
            .attr("stroke", colors[selectedStates.length % 8])
            .style("opacity", 1)

        d3.select(".state." + state)
          .classed("state--selected", true)
          .select("rect")
            .style("fill", colors[selectedStates.length % 8])

    } else {
        selectedStates.splice(selectedStates.indexOf(state), 1)
        //select Line
        d3.selectAll("line." + state)
            .moveToFront()
            .attr("stroke-width", 1)
            .attr("stroke", color)
            .style("opacity", 0.3)

        d3.select(".state." + state)
          .classed("state--selected", false)
          .select("rect")
            .style("fill", "#dedede")
    }

}

function hoverHighlight(state, onOff){

    if (d3.select(".state." + state).classed("state--selected") == false){
      if(onOff == "on"){
          //select Line
          d3.selectAll("line." + state)
              .moveToFront()
              .attr("stroke-width", 3)
              .style("opacity", 1)

          d3.select(".state." + state)
            .select("rect")
            .attr("fill", "#f0f0f0")

      } else {

          //select Line
          d3.selectAll("line." + state)
              .moveToFront()
              .attr("stroke-width", 1)
              .style("opacity", 0.3)

          d3.select(".state." + state)
            .moveToFront()
            .select("rect")
            .transition()
            .duration(400)
            .attr("fill", "#dedede")
      }
    }
}
