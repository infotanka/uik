var RED = 'rgb(211,56,0)';
var ORANGE = 'rgb(232,204,0)';
var YELLOW = 'rgb(234,239,0)';
var GREEN = 'rgb(109,193,55)';

var getUicColor = function (uic, palette) {
    if (palette == 'observers') {
        switch (uic.total) {
            case 0:
                return RED;
            case 1:
                return ORANGE;
            case 2:
                return YELLOW;
        }
        return GREEN;
    }
    var p = uic.outdoorPercents;
    if (p > 20) return RED;
    if (p > 10) return ORANGE;
    if (p > 5) return YELLOW;
    return GREEN;
};

var getUicScale = function (uic) {
    var p = uic.sobyaninPercents - 27;
    if (p < 1) p = 1;
    return Math.sqrt(p) * 0.8;
};

var margin = {top: 20, right: 30, bottom: 20, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var y = d3.scale.log()
    .domain([0, 100])
    .range([height, 0]);

var x = d3.scale.linear()
    .domain([20, 100])
    .range([0, width]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

function createSvg(clz) {
    var svg = d3.select("body").append("svg").classed(clz, true)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var gy = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    var gx = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    return svg;
}
$.get('http://devgru.github.io/uik/uiks.json', function (data) {
    createSvg('diff').selectAll('circle').data(data).enter().append('circle')
        .attr('cx',function (uik) {
            return x(uik.sobyaninPercents);
        }).attr('cy',function (uik) {
            return y(uik.outdoorPercents);
        }).attr('fill',function (uik) {
            return getUicColor(uik, 'observers');
        }).attr('r', getUicScale);

    createSvg('undiff').selectAll('circle').data(data).enter().append('circle')
        .attr('cx',function (uik) {
            return x(uik.sobyaninPercents);
        }).attr('cy',function (uik) {
            return y(uik.outdoorPercents);
        }).attr('fill',function (uik) {
            return getUicColor(uik, 'observers');
        }).attr('r', 1.5);
});

