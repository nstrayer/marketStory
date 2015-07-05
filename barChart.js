var height = 850,
    width = 500,
    padding = 10;

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

    var y = d3.scale.ordinal()
        .domain(d3.range(data.length))
		.rangeRoundBands([padding,height-padding],0.2);

    var x = d3.scale.linear()
        .domain([0, d3.max(data, function(d){return d.numMarkets})])
        .range([padding, width - padding])

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("y", function(d,i){return y(i)})
        .attr("x", function(d){return 0})
        .attr("height", y.rangeBand())
        .attr("width", function(d){return x(d.numMarkets)})
        .attr("fill", "#7fcdbb")
        .on("mouseover", function(d){
            console.log(d)
            updateBars("popPerMarket")
        })

    // svg.selectAll("circle")
    //     .data(data)
    //     .enter()
    //     .append("circle")
    //     .attr("cx", function(d,i){return x(i)})
    //     .attr("cy", function(d){return y(d.numMarkets)})
    //     .attr("r", 5)
    //     .attr("fill", "#7fcdbb")
    //     .on("mouseover", function(d){
    //         console.log(d)
    //         updateBars("popPerMarket")
    //     })
    console.table(data)

    //I put my functions down here.

    var changeSize = function(key) {
        x.domain([0, d3.max(data, function(d){return d[key]})])

        svg.selectAll("rect")
            .transition()
            .duration(1500)
            .delay(function(d,i){return i*50})
            // .attr("", function(d){return x(d[key])})
            .attr("width", function(d){return x(d[key])})
    }

    // var changeSize = function(key) {
    //     y.domain([0, d3.max(data, function(d){return d[key]})])
    //
    //     svg.selectAll("circle")
    //         .transition()
    //         .duration(1500)
    //         .delay(function(d,i){return i*50})
    //         .attr("cy", function(d){return y(d[key])})
    // }

    var updateBars = function(key) {
        svg.selectAll("rect")
           .sort(function(a, b) { return d3.descending(a[key], b[key])})
           .transition()
           .duration(1500)
           .attr("y", function(d, i) { return y(i) })
           .each("end", function(d,i){
               // 10 is totally arbitrary. I just only want it going once.
               if (i == 10){changeSize(key)}})
    };


    // var updateBars = function(key) {
    //     svg.selectAll("circle")
    //        .sort(function(a, b) { return d3.descending(a[key], b[key])})
    //        .transition()
    //        .duration(1500)
    //        .attr("cx", function(d, i) { return x(i) })
    //        .each("end", function(d,i){
    //            // 10 is totally arbitrary. I just only want it going once.
    //            if (i == 10){changeSize(key)}})
    // };
})
