var color = d3.scale.category10();

var projection = d3.geo.miller()
    .scale(153)
    .translate([width / 2, height / 2])
    .precision(.1);

var path = d3.geo.path()
    .projection(projection);

var graticule = d3.geo.graticule();

var tooltipWC = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, -10])
    .html(function (n) {
        if (n.ratio > -1) {
            return "<span style='color:red'>" + n.name + "</span> <strong>:" + n.ratio + "</strong>";
        }
        else {
            return "<span style='color:red'>" + n.name + "</span> <strong>: unknown</strong>";
        }
    });

var worldChoropleth = d3.select("#worldChoropleth").append("svg:svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + (100 + margin.top) + ")");

worldChoropleth.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);

worldChoropleth.call(tooltipWC);

queue()
    .defer(d3.json, "data/world-110m.json")
    .defer(d3.csv, "data/worldEmploymentToPopulationRatio.csv")
    .await(ready);

function ready(error, world, names) {
    if (error) throw error;

    var countries = topojson.feature(world, world.objects.countries).features;
    countries.forEach(function (d) {
        d.name = names.filter(function (n) {
            return d.id == n.id;
        })[0].name;
        d.ratio = names.filter(function (n) {
            return d.id == n.id;
        })[0].ratio;
        d.region = names.filter(function (n) {
            return d.id == n.id;
        })[0].region;
    });

    var country = worldChoropleth.selectAll(".country").data(countries);

    country
        .enter()
        .insert("path")
        .attr("class", "country")
        .attr("title", function (d, i) {
            return d.name;
        })
        .attr("d", path)
        .style("fill", function (d) {
            return colorScale(colorRegion(d));
        })
        .append("title")
        .text(function (d) {
            return d.name;
        });

    country
        .on('mouseover', tooltipWC.show)
        .on('mouseout', tooltipWC.hide);
}