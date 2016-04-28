/**
 * Created by Shreeprabha on 10-12-2015.
 */
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 1900 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var colorScale = d3.scale.category10();

function colorRegion(d) {
    return d.region;
}