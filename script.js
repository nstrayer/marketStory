var height = 850,
    width = 500,
    padding = 10;

var svg = d3.select("#viz").append("svg")
    .attr("height", height)
    .attr("width", width)

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

    var x = d3.scale.ordinal()
        .domain(d3.range(data.length))
		.rangeRoundBands([0,width],0.2);

    var yNumMarkets = d3.scale.linear()
        .domain([0, d3.max(data, function(d){return d.numMarkets})])
        .range([height - padding, padding])

    var yPopPerMarket = d3.scale.linear()
        .domain([0, d3.max(data, function(d){return d.popPerMarket})])
        .range([height - padding, padding])

    var yPercAg = d3.scale.linear()
        .domain([0, d3.max(data, function(d){return d.percAg})])
        .range([height - padding, padding])

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d,i){return padding})
        .attr("cy", function(d){return yNumMarkets(d.numMarkets)})
        .attr("r", 5)
        .attr("fill", "#2ca25f")
        .on("click", function(d){
            // d3.select(this).attr("r", 10)
            changePosition()
            // animatelines("step0")
        })
        // .on("mouseout", function(d){d3.select(this).attr("r", 5)})

    svg.selectAll(".step0")
        .data(data)
        .enter()
        .append("line")
        // .attr("id", function(d,i){return "line" + i})
        .attr("id", function(d,i){return "step0_line" + i})
        .attr("class", function(d,i) {return "line step0 " + d.abrev })
        .attr("x1", padding )     // x position of the first end of the line
        .attr("y1", function(d){return yNumMarkets(d.numMarkets)})      // y position of the first end of the line
        .attr("x2", padding + 200)     // x position of the second end of the line
        .attr("y2", function(d){return yPopPerMarket(d.popPerMarket)})    // y position of the second end of the line
        .attr("stroke", "#99d8c9")
        // .attr("stroke-opacity", 0.5)
        .attr("stroke-width", 1)
        .style("opacity",0);


    svg.selectAll(".step1")
        .data(data)
        .enter()
        .append("line")
        .attr("id", function(d,i){return "step1_line" + i})
        .attr("class", function(d,i) {return "line step1 " + d.abrev })
        .attr("x1", padding + 200)     // x position of the first end of the line
        .attr("y1", function(d){return yPopPerMarket(d.popPerMarket)})      // y position of the first end of the line
        .attr("x2", padding + 200*2)     // x position of the second end of the line
        .attr("y2", function(d){return yPercAg(d.percAg)})    // y position of the second end of the line
        .attr("stroke", "#99d8c9")
        // .attr("stroke-opacity", 0.5)
        .attr("stroke-width", 1)
        .style("opacity",0);


    // console.table(data)

    //I put my functions down here.

    var changePosition = function() {

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
            // .delayNumMarkets(function(d,i){return i*50})
            .attr("cy", function(d){return scale(d[key])})
            .attr("cx", function(d,i){return padding + 200*(count+1)})

        count = count + 1
    }

})

function animatelines(step) {

    d3.selectAll("." + step).style("opacity","0.5");

    //Select All of the lines and process them one by one
    d3.selectAll("." + step).each(function(d,i){

    var yd = d3.select(this).attr("y2") - d3.select(this).attr("y1"),
        xd = d3.select(this).attr("x2") - d3.select(this).attr("x1"),
        totalLength = Math.sqrt(xd*xd + yd*yd);

    console.log(totalLength)

	d3.select("#" + step + "_" + "line" + i).attr("stroke-dasharray", totalLength + " " + totalLength)
	  .attr("stroke-dashoffset", totalLength)
	  .transition()
	  .duration(2500)
	  .ease("linear") //Try linear, quad, bounce... see other examples here - http://bl.ocks.org/hunzy/9929724
	  .attr("stroke-dashoffset", 0)
	//   .style("stroke-width",3)

    })

}
