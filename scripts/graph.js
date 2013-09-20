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

// размеры рабочей области
var margin = {top: 20, right: 30, bottom: 80, left: 50},
    width = 1200 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

var minY = 0.1;

// лог-шкала надомного голосования
var yOutdoor = d3.scale.log()
    .domain([minY, 100])
    .range([height, 0]);

// отступ для нуля на лог-шкале
var y0Offset = 20;

// нуль
var y0 = d3.scale.ordinal()
    .domain([0])
    .range([height + y0Offset]);

// рисуем ось для нуля
var y0Axis = d3.svg.axis()
    .scale(y0)
    .orient("left");

// рисуем основную ось
var yOutdoorAxis = d3.svg.axis()
    .scale(yOutdoor)
    .orient("left")
    .ticks(20, d3.format(",.1s"));

var xSobyanin = d3.scale.linear()
    .domain([30, 100])
    .range([0, width]);

var xObservers = d3.scale.linear()
    .domain([0, 5])
    .range([0, width]);

var yObservers = d3.scale.linear()
    .domain([0, 5])
    .range([0, width]);

var xSobyaninAxis = d3.svg.axis()
    .scale(xSobyanin)
    .orient("bottom");

var xObserversAxis = d3.svg.axis()
    .scale(xObservers)
    .orient("bottom");

$.get('http://devgru.github.io/uik/uiks.json', function (data) {

//    data = data.slice(0, 50);

    var svg;
    // svg = d3.select("body").append("svg")
    //     .attr("width", width + margin.left + margin.right)
    //     .attr("height", height + margin.top + margin.bottom)
    //     .append("g")
    //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // svg.append("g")
    //     .attr("class", "y axis")
    //     .call(yOutdoorAxis);

    // svg.append("g")
    //     .attr("class", "x axis")
    //     .attr("transform", "translate(0," + (height + y0Offset) + ")")
    //     .call(xSobyaninAxis);

    // svg.append("g")
    //     .attr("class", "y-zero axis")
    //     .call(y0Axis);

    // svg
    //     .selectAll('circle')
    //     .data(data)
    //     .enter()
    //     .append('circle')
    //     .attr('cx',function (uik) {
    //         return xSobyanin(uik.sobyaninPercents);
    //     }).attr('cy',function (uik) {
    //         if (uik.outdoorPercents == 0) return yOutdoor(minY) + y0Offset;
    //         return yOutdoor(uik.outdoorPercents);
    //     }).attr('fill',function (uik) {
    //         return getUicColor(uik, 'observers');
    //     }).attr('r', 1.5);


    // svg = d3.select("body").append("svg")
    //     .attr("width", width + margin.left + margin.right)
    //     .attr("height", height + margin.top + margin.bottom)
    //     .append("g")
    //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // svg.append("g")
    //     .attr("class", "y axis")
    //     .call(yOutdoorAxis);

    // svg.append("g")
    //     .attr("class", "x axis")
    //     .attr("transform", "translate(0," + (height + y0Offset) + ")")
    //     .call(xSobyaninAxis);

    // svg
    //     .selectAll('circle')
    //     .data(data)
    //     .enter()
    //     .append('circle')
    //     .attr('cx',function (uik) {
    //         return xSobyanin(uik.sobyaninPercents);
    //     }).attr('cy',function (uik) {
    //         return yObservers(uik.observer + Math.random());
    //     }).attr('fill',function (uik) {
    //         return getUicColor(uik, 'outdoorPercents');
    //     }).attr('r', 1.5);


    svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "y axis")
        .call(yOutdoorAxis);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height + y0Offset) + ")")
        .call(xObserversAxis);

    svg.append("g")
        .attr("class", "y-zero axis")
        .call(y0Axis);


    newbies = svg
        .selectAll('circle')
        .data(data)
        .enter();

    var colorScale = d3.scale.linear()
        .domain([0, 100])
        .interpolate(d3.interpolateHsl)
        .range(["hsl(800, 0%, 100%)", "hsl(910, 80%, 0%)"]);

    newbies
        .append('circle')
        .attr('cx',function (uik) {
            return xObservers(uik.observer + Math.random());
        })
        .attr('cy',function (uik) {
            if (uik.outdoorPercents == 0) return yOutdoor(minY) + y0Offset;
            return yOutdoor(uik.outdoorPercents);
        })
        .attr('fill', function (uik) { return colorScale(uik.sobyaninPercents)})
        .attr('r', function (uik) {
            if (uik.sobyaninPercents >80) return "4";
            else if (uik.sobyaninPercents >50) return "1";
            return "1";
        });

    /*
    newbies
        .append('circle')
        .attr('cx',function (uik) {
            return xObservers(uik.observer + uik.sobyaninPercents/100);
        })
        .attr('cy', function (uik) {
            if (uik.outdoorPercents == 0) return yOutdoor(minY) + y0Offset;
            return yOutdoor(uik.outdoorPercents);
        })
        .attr('fill', 'transparent')
        .attr('stroke', 'rgb(200,200,200)')
        .attr('r', 10);
    */

});

