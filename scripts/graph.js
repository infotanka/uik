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

var margin = {top: 20, right: 30, bottom: 80, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var minY = 0.1;
var y0Offset = 20;

var yOutdoor = d3.scale.log()
    .domain([minY, 100])
    .range([height, 0]);

var y0 = d3.scale.ordinal()
    .domain([0])
    .range([height + y0Offset]);

var y0Axis = d3.svg.axis()
    .scale(y0)
    .orient("left");

var xSobyanin = d3.scale.linear()
    .domain([30, 100])
    .range([0, width]);

var xObservers = d3.scale.linear()
    .domain([0, 10])
    .range([0, width]);

var xSobyaninAxis = d3.svg.axis()
    .scale(xSobyanin)
    .orient("bottom");

var xObserversAxis = d3.svg.axis()
    .scale(xObservers)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(yOutdoor)
    .orient("left")
    .ticks(20, d3.format(",.1s"));

$.get('http://devgru.github.io/uik/uiks.json', function (data) {
    var svg;
    svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height + y0Offset) + ")")
        .call(xSobyaninAxis);

    svg.append("g")
        .attr("class", "y-zero axis")
        .call(y0Axis);

    svg
        .selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx',function (uik) {
            return xSobyanin(uik.sobyaninPercents);
        }).attr('cy',function (uik) {
            if (uik.outdoorPercents == 0) return yOutdoor(minY) + y0Offset;
            console.log(uik.outdoorPercents, yOutdoor(uik.outdoorPercents));
            return yOutdoor(uik.outdoorPercents);
        }).attr('fill',function (uik) {
            return getUicColor(uik, 'observers');
        }).attr('r', 2);


    svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height + y0Offset) + ")")
        .call(xObserversAxis);

    svg.append("g")
        .attr("class", "y-zero axis")
        .call(y0Axis);


    svg
        .selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx',function (uik) {
            return xObservers(uik.observer);
        }).attr('cy',function (uik) {
            if (uik.outdoorPercents == 0) return yOutdoor(minY) + y0Offset;
            console.log(uik.outdoorPercents, yOutdoor(uik.outdoorPercents));
            return yOutdoor(uik.outdoorPercents);
        }).attr('fill', 'gray').attr('r', function (uik) {
            return 0.5 + Math.sqrt(uik.sobyaninPercents);
        });
});

