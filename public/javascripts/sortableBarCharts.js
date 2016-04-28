/**
 * Created by Shreeprabha on 10-12-2015.
 */
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .2, 9);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function (d) {
        return "<strong>easeOfDoingBusiness2015:</strong> <span style='color:red'>" + d.easeOfDoingBusiness2015 + "</span>";
    });

var sortableBarChart = d3.select("#sortableBarChart").append("svg:svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + (100 + margin.top) + ")");

sortableBarChart.call(tip);
queue()
    .defer(d3.csv, "data/Ease-of-Doing-Business.csv")
    .defer(d3.csv, "data/Ease-of-Doing-Business-10.csv")
    .await(ready);

function ready(error, data, data10) {
    if (error) throw error;

    data.forEach(function (d) {
        d.easeOfDoingBusiness2015 = +d.easeOfDoingBusiness2015;
    });

    data10.forEach(function (d) {
        d.easeOfDoingBusiness2015 = +d.easeOfDoingBusiness2015;
    });

    showAll();

    y.domain([0, d3.max(data, function (d) {
        return d.easeOfDoingBusiness2015;
    })]);

    sortableBarChart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, 750)")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "start")
        .attr("transform", "rotate(90)")
        .attr("x", 2)
        .attr("dx", "1em")
        .attr("dy", "-2.5em");

    sortableBarChart.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Ease of Doing Business Rank");


    sortableBarChart.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return x(d.name);
        })
        .attr("dx", "-2em")
        .attr("width", x.rangeBand() + 4)
        .attr("y", function (d) {
            return y(d.easeOfDoingBusiness2015);
        })
        .attr("height", function (d) {
            return height - y(d.easeOfDoingBusiness2015);
        })
        .style("fill", function (d) {
            return colorScale(colorRegion(d));
        })
        .append("title")
        .text(function (d) {
            return d.name + ": " +  d.easeOfDoingBusiness2015 ;
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    d3.select("#rankInput").on("change", change);
    d3.select("#showInput").on("change", showAll);

    function showAll() {
        x.domain(data.map(function (d) {
            return d.name;
        }));
    }

    function change() {
        var x0 = x.domain(data.sort(this.checked
                ? function (a, b) {
                return b.easeOfDoingBusiness2015 - a.easeOfDoingBusiness2015;
            }
                : function (a, b) {
                return d3.ascending(a.name, b.name);
            })
            .map(function (d) {
                return d.name;
            }))
            .copy();

        sortableBarChart.selectAll(".bar")
            .sort(function (a, b) {
                return x0(a.name) - x0(b.name);
            });

        var transition = sortableBarChart.transition().duration(750),
            delay = function (d, i) {
                return i * 50;
            };

        transition.selectAll(".bar")
            .delay(delay)
            .attr("x", function (d) {
                return x0(d.name);
            });

        transition.select(".x.axis")
            .call(xAxis)
            .selectAll("g")
            .delay(delay);
    }
}