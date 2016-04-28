/**
 * Created by Shreeprabha on 11-12-2015.
 */

function xIncome(d) {
    return d.income;
}

function yLifeExepectancy(d) {
    return d.lifeExpectancy;
}

function radius(d) {
    return d.population;
}


function key(d) {
    return d.name;
}

var marginDS = {top: 19.5, right: 19.5, bottom: 19.5, left: 39.5},
    widthDS = 860 - marginDS.right,
    heightDS = 400 - marginDS.top - marginDS.bottom;


var xScaleDS = d3.scale.log().domain([300, 1e5]).range([0, widthDS]),
    yScaleDS = d3.scale.linear().domain([10, 85]).range([heightDS, 0]),
    radiusScale = d3.scale.sqrt().domain([0, 5e8]).range([0, 40]);

var xIncomeAxis = d3.svg.axis().orient("bottom").scale(xScaleDS).ticks(14, d3.format(",d")),
    yLifeExpectancyAxis = d3.svg.axis().scale(yScaleDS).orient("left");

var draggableScatterplot = d3.select("#draggableScatterplot").append("svg:svg")
    .attr("widthDS", widthDS + marginDS.left + marginDS.right)
    .attr("heightDS", heightDS + marginDS.top + marginDS.bottom)
    .append("g")
    .attr("transform", "translate(" + marginDS.left + "," + marginDS.top + ")");

draggableScatterplot.append("g")
    .attr("class", "xIncome axis")
    .attr("transform", "translate(0," + heightDS + ")")
    .call(xIncomeAxis);

draggableScatterplot.append("g")
    .attr("class", "yLifeExepectancy axis")
    .call(yLifeExpectancyAxis);

draggableScatterplot.append("text")
    .attr("class", "xIncome labelDS")
    .attr("text-anchor", "end")
    .attr("xIncome", widthDS)
    .attr("yLifeExepectancy", heightDS - marginDS.top)
    .attr("transform", "translate(" + widthDS + ", " + heightDS + ")")
    .attr("dy", "-.9em")
    .text("GDP PPP inflation-adjusted (dollars)");

draggableScatterplot.append("text")
    .attr("class", "yLifeExepectancy labelDS")
    .attr("text-anchor", "end")
    .attr("yLifeExepectancy", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("life expectancy (years)");

var labelDS = draggableScatterplot.append("text")
    .attr("class", "year labelDS")
    .attr("text-anchor", "end")
    .attr("yLifeExepectancy", heightDS - 24)
    .attr("xIncome", widthDS)
    .attr("transform", "translate(" + widthDS + ", " + heightDS + ")")
    .attr("dy", "-.9em")
    .text(1900);

d3.json("data/populationLifeExpectancyIncome.json", function(nations) {

    // A bisector since many nation's data is sparsely-defined.
    var bisect = d3.bisector(function(d) { return d[0]; });

    // Add a dot per nation. Initialize the data at 1900, and set the colors.
    var dot = draggableScatterplot.append("g")
        .attr("class", "dots")
        .selectAll(".dot")
        .data(interpolateData(1900))
        .enter().append("circle")
        .attr("class", "dot")
        .style("fill", function(d) { return colorScale(colorRegion(d)); })
        .call(position)
        .sort(order);

    // Add a title.
    dot.append("title")
        .text(function(d) { return d.name + ": " + d.population; });

    // Add an overlay for the year labelDS.
    var box = labelDS.node().getBBox();

    var overlay = draggableScatterplot.append("rect")
        .attr("class", "overlay")
        .attr("xIncome", box.x)
        .attr("yLifeExepectancy", box.y)
        .attr("widthDS", box.widthDS)
        .attr("heightDS", box.heightDS)
        .on("mouseover", enableInteraction);

    // Start a transition that interpolates the data based on year.
    draggableScatterplot.transition()
        .duration(30000)
        .ease("linear")
        .tween("year", tweenYear)
        .each("end", enableInteraction);

    // Positions the dots based on data.
    function position(dot) {
        dot .attr("cx", function(d) { return xScaleDS(xIncome(d)); })
            .attr("cy", function(d) { return yScaleDS(yLifeExepectancy(d)); })
            .attr("r", function(d) { return radiusScale(radius(d)); });
    }

    // Defines a sort order so that the smallest dots are drawn on top.
    function order(a, b) {
        return radius(b) - radius(a);
    }

    // After the transition finishes, you can mouseover to change the year.
    function enableInteraction() {
        var yearScale = d3.scale.linear()
            .domain([1900, 2011])
            .range([box.x + 10, box.x + box.widthDS - 10])
            .clamp(true);

        // Cancel the current transition, if any.
        draggableScatterplot.transition().duration(0);

        overlay
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .on("mousemove", mousemove)
            .on("touchmove", mousemove);

        function mouseover() {
            labelDS.classed("active", true);
        }

        function mouseout() {
            labelDS.classed("active", false);
        }

        function mousemove() {
            displayYear(yearScale.invert(d3.mouse(this)[0]));
        }
    }

    // Tweens the entire chart by first tweening the year, and then the data.
    // For the interpolated data, the dots and labelDS are redrawn.
    function tweenYear() {
        var year = d3.interpolateNumber(1900, 2009);
        return function(t) { displayYear(year(t)); };
    }

    // Updates the display to show the specified year.
    function displayYear(year) {
        dot.data(interpolateData(year), key).call(position).sort(order);
        labelDS.text(Math.round(year));
    }

    // Interpolates the dataset for the given (fractional) year.
    function interpolateData(year) {
        return nations.map(function(d) {
            return {
                name: d.name,
                region: d.region,
                income: interpolateValues(d.income, year),
                population: interpolateValues(d.population, year),
                lifeExpectancy: interpolateValues(d.lifeExpectancy, year)
            };
        });
    }

    // Finds (and possibly interpolates) the value for the specified year.
    function interpolateValues(values, year) {
        var i = bisect.left(values, year, 0, values.length - 1),
            a = values[i];
        if (i > 0) {
            var b = values[i - 1],
                t = (year - a[0]) / (b[0] - a[0]);
            return a[1] * (1 - t) + b[1] * t;
        }
        return a[1];
    }
});