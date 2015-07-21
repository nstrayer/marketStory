var colors = ['rgb(141,211,199)','rgb(190,186,218)','rgb(251,128,114)','rgb(128,177,211)','rgb(253,180,98)','rgb(179,222,105)','rgb(252,205,229)','rgb(188,128,189)']
var newEngland = ["VT", "MA", "ME", "RI", "NH", "CT"],
    outliers   = ["CA", "TX", "VT", "NY", "SD"],
    highAg     = ["ID", "MT", "ND", "SD", "IA", "NE", "KS"];

var groupings = [{"group": "New England" , "states": ["ME", "NH", "VT", "MA", "CT", "RI"]},
                 {"group": "Outliers",    "states": ["CA", "TX", "SD", "NY", "VT"]},
                 {"group": "High Ag",      "states": ["ID", "MT", "ND", "SD", "IA", "NE", "KS"]},
                 {"group": "Southeast" ,  "states": ["AR", "MS", "NC", "GA", "SC", "AL", "TN", "LA"]}]

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

    //define behavior for showing text values of metrics.
    if (onOff == "on"){ //add text
        d3.select(".line." + state)//grab the line and its associated data
            .each(function(d,i){
                var labelData = [
                    {"ident": "numMarkets",  "label": Math.round(d.numMarkets),   "val": yNumMarkets(d.numMarkets)},
                    {"ident": "popPerMaret", "label": Math.round(d.popPerMarket), "val": yPopPerMarket(d.popPerMarket)},
                    {"ident": "percAg",      "label": Math.round(d.percAg * 100)/100,       "val": yPercAg(d.percAg)}
                ]

                svg.selectAll("valueLabels")
                    .data(labelData).enter()
                    .append("text")
                    .attr("class", "valueLabels")
                    .attr("id", function(d){return d.ident})
                    .attr("y",  function(d){return d.val})
                    .attr("x",  function(d,i){return x(i + 0.01)})
                    .text(function(d){return d.label})
            })
    }else { //remove it
        d3.selectAll(".valueLabels").remove()
    }
    if (d3.select(".state." + state).classed("state--selected") == false){
      if(onOff == "on"){
          //select Line
          d3.selectAll("line." + state)
              .moveToFront()
              .attr("stroke-width", 3)
              .style("opacity", 0.3)
              .attr("stroke", "black")

          d3.select(".state." + state)
            .select("rect")
            .attr("fill", "#f0f0f0")

      } else {

          //select Line
          d3.selectAll("line." + state)
              .moveToFront()
              .attr("stroke-width", 1)
              .style("opacity", 0.3)
              .attr("stroke", color)

          d3.select(".state." + state)
            .moveToFront()
            .select("rect")
            .transition()
            .duration(400)
            .attr("fill", "#dedede")
      }
    }
}

var stateTimeouts = [];
function massHightlight(states){
  var oldStates = selectedStates

  // // This was an attempt to keep already highlighted states highlighted. Didn't work too well.
  // var newStates = states
  // //add something that checks overlap between the two groups. Takes out from the remove groups
  // // the ones that are in the wanted, then also takes those out from the add group. Use the
  // //functions from the selected states thingy.
  // for (var i = 0; i < newStates.length; i++){
  //   var location = oldStates.indexOf(newStates[i])
  //   if(location != -1){ //if the new state is in the selected states already
  //     oldStates.splice(location, 1) //take it out of the to remove...
  //     states.splice(location,1)// ...and the to add lists
  //   }
  // }

  //don't highlight the rest of the states if we've chosen new states
  stateTimeouts.forEach(function(d,i){
    clearTimeout(d);
  });
  stateTimeouts.length = 0; //empties the current array without creating a new one

  oldStates.forEach(function(d,i){
    window.setTimeout(function(){
      highlight(d, "off");
      console.log("turning off!", d.abrev);
    }, 1);
  });
  states.forEach(function(d,i){
    stateTimeouts.push(window.setTimeout(function(){
      highlight(d, "on");
      console.log("turning on!", d.abrev);
    }, 180*i));
  });
}

function hoverInteraction(on){
  if(on){
    d3.selectAll(".line")
        .on("mouseover", function(d){ hoverHighlight(d.abrev, "on") })
        .on("mouseout",  function(d){ hoverHighlight(d.abrev, "off") })

    d3.selectAll(".state")
        .on("mouseover", function(d){ hoverHighlight(d.name, "on") })
        .on("mouseout",  function(d){ hoverHighlight(d.name, "off") })
  } else {
    d3.selectAll(".line")
        .on("mouseover", function(d){})
        .on("mouseout",  function(d){})

    d3.selectAll(".state")
        .on("mouseover", function(d){})
        .on("mouseout",  function(d){})
  }
}
