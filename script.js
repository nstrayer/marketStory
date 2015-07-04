var height = 600,
    width = 1000,
    padding = 20;

var svg = d3.select("#viz").append("svg")
    .attr("height", height)
    .attr("width", width)

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

    var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d){return d.numMarkets})])
        .range([height - padding, padding])

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d,i){return x(i)})
        .attr("y", function(d){return y(d.numMarkets)})
        .attr("width", x.rangeBand())
        .attr("height", function(d){return height - y(d.numMarkets)})
        .attr("fill", "#7fcdbb")
        .on("mouseover", function(d){
            console.log(d)
            updateBars("popPerMarket")
        })

    // console.table(data)

    //I put my functions down here.

    var changeSize = function(key) {
        y.domain([0, d3.max(data, function(d){return d[key]})])

        svg.selectAll("rect")
            .transition()
            .duration(1500)
            .attr("y", function(d){return y(d[key])})
            .attr("height", function(d){return height - y(d[key])})
    }

    var updateBars = function(key) {
        svg.selectAll("rect")
           .sort(function(a, b) { return d3.descending(a[key], b[key])})
           .transition()
           .duration(1500)
           .attr("x", function(d, i) { return x(i) })
           .each("end", function(d,i){
               // 10 is totally arbitrary. I just only want it going once.
               if (i == 10){changeSize(key)}})
    };
})
