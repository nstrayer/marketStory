/*
 * scrollVis - encapsulates
 * all the code for the visualization
 * using reusable charts pattern:
 * http://bost.ocks.org/mike/chart/
 */
var scrollVis = function() {
    // constants to define the size
    // and margins of the vis area.

    var width   = 580,
        height  = 520,
        margin  = { top: 10, left: 20, bottom: 40, right: 10 },
        padding = 20,
        colors  = ['#1b9e77', '#d95f02', '#7570b3'];

    // Keep track of which visualization
    // we are on and which was the last
    // index activated. When user scrolls
    // quickly, we want to call all the
    // activate functions that they pass.
    var lastIndex = -1;
    var activeIndex = 0;

    // main svg used for visualization
    var svg = null;

    // d3 selection that will be used
    // for displaying visualizations
    var g = null;

    var x = d3.scale.linear()
        .domain([0, 1.1])
        .range([padding, width]);

    var y = d3.scale.linear()
        .domain([4, 6.9])
        .range([height, padding]);

    var yAxis = d3.svg.axis()
    			.scale(y)
    			.orient("left")

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([0, 15])
      .html(function(d) {
        if(d3.select(this).style("opacity") == 1){console.log("visible!")}
        return "<strong>Description:</strong> <span style='color:red'>" + d.descrip + "</span>";
      })

    function customAxis(g) {
		g.selectAll("text")
		.attr("x", -2)
		.attr("dy", -2);
		g
		.attr("transform", "translate(" + 28 + ",0)")
	}

    var line = d3.svg.line()
        .interpolate("basis")
        .x(function(d) { return x(d.x); })
        .y(function(d) { return y(d.y); });

    var lineStart = d3.svg.line()
        .interpolate("basis")
        .x(function(d) { return x(d.x); })
        .y(function(d) { return 0; });

    //https://gist.github.com/alexhornbake/6005176
    function makeCurlyBrace(x1,y1,x2,y2,w,q)
		{
			//Calculate unit vector
			var dx = x1-x2;
			var dy = y1-y2;
			var len = Math.sqrt(dx*dx + dy*dy);
			dx = dx / len;
			dy = dy / len;

			//Calculate Control Points of path,
			var qx1 = x1 + q*w*dy;
			var qy1 = y1 - q*w*dx;
			var qx2 = (x1 - .25*len*dx) + (1-q)*w*dy;
			var qy2 = (y1 - .25*len*dy) - (1-q)*w*dx;
			var tx1 = (x1 -  .5*len*dx) + w*dy;
			var ty1 = (y1 -  .5*len*dy) - w*dx;
			var qx3 = x2 + q*w*dy;
			var qy3 = y2 - q*w*dx;
			var qx4 = (x1 - .75*len*dx) + (1-q)*w*dy;
			var qy4 = (y1 - .75*len*dy) - (1-q)*w*dx;

    	return ( "M " +  x1 + " " +  y1 +
         		" Q " + qx1 + " " + qy1 + " " + qx2 + " " + qy2 +
          		" T " + tx1 + " " + ty1 +
          		" M " +  x2 + " " +  y2 +
          		" Q " + qx3 + " " + qy3 + " " + qx4 + " " + qy4 +
          		" T " + tx1 + " " + ty1 );
		}

    var legendData = [
        {
            "id": "EPA",
            "color": "rgb(117,112,179)",
            "descrip": "This is the EPA"
        },
        {
            "id": "FAOSTAT",
            "color": "rgb(217,95,2)",
            "descrip": "This is the FAOSTAT"
        },
        {
            "id": "RCP2.6",
            "color": "rgb(27,158,119)",
            "descrip": "This is the RCP2.6"
        },
        {
            "id": "Projected",
            "color": "steelblue",
            "descrip": "This is the the projected line."
        }
        ]

    var apart = [
        [{
            "id": "RCP2.6",
            "color": "rgb(27,158,119)",
            "x": 0,
            "y": 6.03
        }, {
            "id": "RCP2.6",
            "color": "rgb(27,158,119)",
            "x": 1,
            "y": 5.55
        }],
        [{
            "id": "FAOSTAT",
            "color": "rgb(217,95,2)",
            "x": 0,
            "y": 5.24
        }, {
            "id": "FAOSTAT",
            "color": "rgb(217,95,2)",
            "x": 1,
            "y": 5.76
        }],
        [{
            "id": "EPA",
            "color": "rgb(117,112,179)",
            "x": 0,
            "y": 6.0
        }, {
            "id": "EPA",
            "color": "rgb(117,112,179)",
            "x": 1,
            "y": 6.95
        }]
    ]
    var together = [
        [{
            "x": 0,
            "y": 5.24
        }, {
            "x": 1,
            "y": 4.82
        }],
        [{
            "x": 0,
            "y": 5.24
        }, {
            "x": 1,
            "y": 5.76
        }],
        [{
            "x": 0,
            "y": 5.24
        }, {
            "x": 1,
            "y": 6.07
        }]
    ]

    var bump = 0.0
    var distances = [
        [{
            "x": 1.0,
            "y": 5.76 + bump
        }, {
            "x": 1.0,
            "y": 6.07 - bump
        }],
        [{
            "x": 1.0,
            "y": 4.82 + bump
        }, {
            "x": 1.0,
            "y": 5.76 - bump
        }]
    ]

    var twoBLine1 = [
        [{"id": "bumpLine","x": 0,"y": 5.24},
         {"id": "bumpLine","x": 1,"y": 5.76}]
    ]
    var twoBLine2 = [
        [{"id": "bumpLine","x": 0,"y": 5.24},
         {"id": "bumpLine","x": 1,"y": 5.76 - 0.003}]
    ]

    var twoCLine = [
        [{"id": "bumpLine","x": 0,"y": 5.24},
         {"id": "bumpLine","x": 1,"y": 5.76 - 0.003 - .002}]
    ]

    var twoDLine = [
        [{"id": "bumpLine","x": 0,"y": 5.24},
         {"id": "bumpLine","x": 1,"y": 5.76 - 0.003 - .002 - .042}]
    ]

    var twoELine = [
        [{"id": "bumpLine","x": 0,"y": 5.24},
         {"id": "bumpLine","x": 1,"y": 5.76 - 0.003 - .002 - .042 - .192}]
    ]

    var twoFLine = [
        [{"id": "bumpLine","x": 0,"y": 5.24},
         {"id": "bumpLine","x": 1,"y": 5.76 - 0.003 - .002 - .042 - .192 - .04}]
    ]

    var twoGLine = [
        [{"id": "bumpLine","x": 0,"y": 5.24},
         {"id": "bumpLine","x": 1,"y": 5.76 - 0.003 - .002 - .042 - .192 - .04 - .002}]
    ]

    var twoHLine = [
        [{"id": "bumpLine","x": 0,"y": 5.24},
         {"id": "bumpLine","x": 1,"y": 5.76 - 0.003 - .002 - .042 - .192 - .04 - .002 - .034}]
    ]

    var distLabels = [{"value": 15, "x": 1.04, "y": 5.915 - .025},
                      {"value": 10, "x": 1.04, "y": 5.29 - .025}]

    //////////////////////////////////////////////////////////////////////

    // When scrolling to a new section
    // the activation function for that
    // section is called.
    var activateFunctions = [];
    // If a section has an update function
    // then it is called while scrolling
    // through the section with the current
    // progress through the section.
    var updateFunctions = [];

    var chart = function(selection) {
        selection.each(function() {
            // create svg and give it a width and height
            svg = d3.select(this).append("svg");
            svg.append("g");

            svg.attr("width", width + margin.left + margin.right);
            svg.attr("height", height + margin.top + margin.bottom);

            // this group element will be used to contain all
            // other elements.
            g = svg.select("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            setupVis();
            setupSections();
        });
    };

    setupVis = function() {
        // count openvis title
        g.append("text")
            .attr("class", "title openvis-title")
            .attr("x", width / 2)
            .attr("y", height / 3)
            .text("Sustainable Agriculture");

        g.append("text")
            .attr("class", "sub-title openvis-title")
            .attr("x", width / 2)
            .attr("y", (height / 3) + (height / 5))
            .text("See Effects of Policy");

        g.selectAll(".openvis-title")
            .attr("opacity", 0);

        var first = g.selectAll(".line").data(apart);
        first.enter()
            .append("path")
            .attr("class", function(d){
                if(d[1].id == "FAOSTAT" || d[1].id == "RCP2.6"){
                    return "line partTwo " + d[1].id
                } else {return "line partOne " + d[1].id}
            })
            .attr("d", lineStart)
            .style("stroke-width", 0)
            .style("stroke", function(d) { return d[1].color });

        var progressLine = g.selectAll(".progressLine").data(twoBLine1);
        progressLine.enter()
            .append("path")
            .attr("class", "progressLine")
            .attr("d", line)
            .style("stroke-width", 0)
            .style("stroke", "steelblue");

        //Axis stuffs!
        var gy = svg.append("g")
        			.attr("class", "axis")
        			.call(yAxis)
                    .call(customAxis)
                    .style("opacity", 0);

        svg.append("text")
            .attr("class", "dates")
            .attr("x", function(){return x(0.02)})
            .attr("y", function(){return (height + 15)})
            .text("2010")
            .attr("text-anchor", "start")

        svg.append("text")
            .attr("class", "dates")
            .attr("x", function(){return x(1)})
            .attr("y", function(){return (height + 15)})
            .text("2030")
            .attr("text-anchor", "start")

        var curlys = g.selectAll(".curlyBraces").data(distances)
        curlys.enter()
            .append("path")
            .attr("class", "curlyBraces dist")
            .transition()
            .duration(0)
            .attr("d", function(d){
                return makeCurlyBrace(x(d[0].x),y(d[0].y),x(d[1].x),y(d[1].y),20,0.5)
                })
            .style("stroke-width", 0)
            .style("stroke", "green")
            .style("fill", "none");

        var labels = g.selectAll(".labels").data(distLabels)
        labels.enter()
            .append("text")
            .attr("class", "labels dist")
            .transition()
            .duration(0)
            .text(function(d){return d.value})
            .attr("x", function(d){return x(d.x)})
            .attr("y", function(d){return y(d.y)})
            .attr("text-anchor", "start")


        var legendRectSize = 18;
        var legendSpacing = 4;
        svg.call(tip);

        var legend = svg.selectAll('.legend')
          .data(legendData)
          .enter()
          .append('g')
          .attr("class", function(d){
              if(d.id == "FAOSTAT" || d.id == "RCP2.6" || d.id == "Projected" ){
                  return "legend partTwo " + d.id
              } else {return "legend partOne " + d.id}
          })
          .attr('transform', function(d,i){
              return "translate(" + 40 +" , " +  (30 + (22 * i)) +")"
          })
        //   .on('mouseover', function(d,i){
        //       if(d3.select(this).style("opacity") != 0){tip.show }
        //       })
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide);

        legend.append('rect')
          .attr('width', legendRectSize)
          .attr('height', legendRectSize)
          .style('fill', function(d){return d.color})

        legend.append('text')
          .attr('x', legendRectSize + legendSpacing)
          .attr('y', legendRectSize - legendSpacing)
          .text(function(d) { return d.id; });
    };

    setupSections = function() {
        // activateFunctions are called each
        // time the active section changes
        activateFunctions[0] = showTitle;
        activateFunctions[1] = oneB;
        activateFunctions[2] = oneC;
        activateFunctions[3] = oneD;
        activateFunctions[4] = twoA;
        activateFunctions[5] = twoB;
        activateFunctions[6] = twoC;
        activateFunctions[7] = twoD;
        activateFunctions[8] = twoE;
        activateFunctions[9] = twoF;
        activateFunctions[10] = twoG;
        activateFunctions[11] = twoH;
    };


    function showTitle() {
        g.selectAll(".count-title")
            .transition()
            .duration(0)
            .attr("opacity", 0);

        g.selectAll(".openvis-title")
            .transition()
            .duration(600)
            .attr("opacity", 1.0);

        g.selectAll(".line")
            .transition()
            .duration(0)
            .attr("d", lineStart)
            .style("stroke-width", 0)

        g.selectAll(".progressLine")
            .style("stroke-width", 0)

        g.selectAll(".curlyBraces")
            .transition()
            .duration(0)
            .style("stroke-width", 0)

        svg.select(".axis").style("opacity", 0);
        svg.selectAll(".dates").style("opacity", 0);
        svg.selectAll(".dist").transition().duration(0).style("opacity", 0);
        svg.selectAll(".legend").style("opacity", 0);

    }

    function showFillerTitle() {
        g.selectAll(".openvis-title")
            .transition()
            .duration(0)
            .attr("opacity", 0);

        g.selectAll(".count-title")
            .transition()
            .duration(0)
            .attr("opacity", 1.0);

        g.selectAll(".progressLine")
            .style("stroke-width", 0)

        g.selectAll(".line")
            .transition()
            .duration(800)
            .attr("d", line)
            .style("stroke-width", 0)

        g.selectAll(".curlyBraces")
            .transition()
            .duration(0)
            .style("stroke-width", 0)

        svg.select(".axis").style("opacity", 0);
        svg.selectAll(".dates").style("opacity", 0);
        svg.selectAll(".dist").transition().duration(0).style("opacity", 0);
        svg.selectAll(".legend").style("opacity", 0);
    }

    function oneB() {
        g.selectAll(".openvis-title")
            .transition()
            .duration(0)
            .attr("opacity", 0);

        //let's wait in case we scroll over this real quick.
        g.selectAll(".line")
            .data(apart)
            .transition()
            .duration(800)
            .attr("d", line)
            .style("stroke-width", 2)

        g.selectAll(".progressLine")
            .style("stroke-width", 0)

        g.selectAll(".curlyBraces").transition().duration(0)
            .style("stroke-width", 0)

        svg.select(".axis")
            .style("opacity", 100);

        svg.selectAll(".dates")
            .style("opacity", 100);

        svg.selectAll(".dist").transition().duration(0).style("opacity", 0);
        svg.selectAll(".legend").style("opacity", 100);
        svg.selectAll(".partOne").style("opacity", 100);
        svg.selectAll(".Projected").style("opacity", 0);
    }

    function oneC(){
        g.selectAll(".openvis-title")
            .transition()
            .duration(0)
            .attr("opacity", 0);

        g.selectAll(".line")
            .data(together)
            .transition()
            .duration(800)
            .attr("d", line)
            .style("stroke-width", 2)

        g.selectAll(".progressLine")
            .style("stroke-width", 0)

        g.selectAll(".curlyBraces")
            .transition()
            .duration(0)
            .style("stroke-width", 0)

        svg.selectAll(".dist").transition().duration(0).style("opacity", 0);
        svg.selectAll(".partOne").style("opacity", 100);
        svg.selectAll(".Projected").style("opacity", 0);
    }

    function oneD(){
        g.selectAll(".openvis-title")
            .transition()
            .duration(0)
            .attr("opacity", 0);

        g.selectAll(".line")
            .data(together)
            .transition()
            .duration(1000)
            .attr("d", line)
            .style("stroke-width", 2)

        g.selectAll(".progressLine")
            .style("stroke-width", 0)

        g.selectAll(".curlyBraces")
            .transition()
            .duration(1000)
            .delay(function(d,i){return 250*i})
            .style("stroke-width", 2)
            .style("opacity", 100)

        g.selectAll(".labels")
            .transition()
            .duration(1000)
            .delay(function(d,i){return 250*i})
            .style("opacity", 100)

        svg.selectAll(".partOne").style("opacity", 100);
        svg.selectAll(".Projected").style("opacity", 0);
    }

    function twoA(){
        g.selectAll(".openvis-title")
            .transition()
            .duration(0)
            .attr("opacity", 0);

        g.selectAll(".partOne")
            .transition()
            .duration(1000)
            .attr("d", line)
            .style("stroke-width", 0)

        g.selectAll(".partTwo")
            .transition()
            .duration(1000)
            .attr("d", line)
            .style("stroke-width", 2)

        g.selectAll(".progressLine")
            .style("stroke-width", 0)

        g.selectAll(".progressLine")
            .data(twoBLine1)
            .transition()
            .duration(1000)
            .attr("d", line)

        g.selectAll(".curlyBraces")
            .transition()
            .duration(1000)
            .style("stroke-width", 0)

        svg.selectAll(".dist").style("opacity", 0);
        svg.selectAll(".partOne").style("opacity", 0);
        svg.selectAll(".partTwo").style("opacity", 100);
    }

    function twoB(){
        g.selectAll(".openvis-title")
            .transition()
            .duration(0)
            .attr("opacity", 0);

        g.selectAll(".partOne")
            .transition()
            .duration(1000)
            .attr("d", line)
            .style("stroke-width", 0)

        g.selectAll(".partTwo")
            .transition()
            .duration(1000)
            .attr("d", line)
            .style("stroke-width", 2)

        g.selectAll(".progressLine")
            .style("stroke-width", 2)

        g.selectAll(".progressLine")
            .data(twoBLine2)
            .transition()
            .duration(1000)
            .attr("d", line)

        g.selectAll(".distances")
            .transition()
            .duration(1000)
            .style("stroke-width", 0)

        svg.selectAll(".dist").style("opacity", 0);
    }

    function linePush(lineData){
        g.selectAll(".openvis-title")
            .transition()
            .duration(0)
            .attr("opacity", 0);

        g.selectAll(".partOne")
            .transition()
            .duration(1000)
            .attr("d", line)
            .style("stroke-width", 0)

        g.selectAll(".partTwo")
            .transition()
            .duration(1000)
            .attr("d", line)
            .style("stroke-width", 2)

        g.selectAll(".progressLine")
            .style("stroke-width", 2)

        g.selectAll(".progressLine")
            .data(lineData)
            .transition()
            .duration(1000)
            .attr("d", line)

        g.selectAll(".distances")
            .transition()
            .duration(1000)
            .style("stroke-width", 0)

        svg.selectAll(".dist").transition().duration(0).style("opacity", 0);
        svg.selectAll(".partOne").style("opacity", 0);
    }

    function twoC(){
        linePush(twoCLine)
    }
    function twoD(){
        linePush(twoDLine)
    }
    function twoE(){
        linePush(twoELine)
    }
    function twoF(){
        linePush(twoFLine)
    }
    function twoG(){
        linePush(twoGLine)
    }
    function twoH(){
        linePush(twoHLine)
    }
    chart.activate = function(index) {
        activeIndex = index;
        var sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
        var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
        scrolledSections.forEach(function(i) {
            activateFunctions[i]();
        });
        lastIndex = activeIndex;
    };

    return chart;
};


function display() {
    // create a new plot and
    // display it
    var plot = scrollVis();
    d3.select("#vis")
        .call(plot);

    // setup scroll functionality
    var scroll = scroller()
        .container(d3.select('#graphic'));

    // pass in .step selection as the steps
    scroll(d3.selectAll('.step'));

    // setup event handling
    scroll.on('active', function(index) {
        // highlight current step text
        d3.selectAll('.step')
            .style('opacity', function(d, i) {
                return i == index ? 1 : 0.1;
            });

        // activate current section
        plot.activate(index);
    });
}

// load data and display
d3.tsv("data/words.tsv", display);
