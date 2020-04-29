var data = [
    {fruit: "bananas", "percentage": 20},
    {fruit: "apples", "percentage": 45},
    {fruit: "carrots", "percentage": 35}
];

var svg = d3.select('#testpieV5').append('svg')
    //select the svg with a class name instead of 'svg.'
    //select the svg with an ID
    .attr("width", 400)
    .attr("height", 400);

var radius = 100;

var g = svg.append("g")
    .attr("transform", "translate(" + radius + "," + radius + ")") ;

var color = d3.scaleOrdinal(["red", "blue", "green"]);

var pie = d3.pie().value(function(d) {
    return d.percentage;
});

var path = d3.arc()
    .outerRadius(radius)
    .innerRadius(0);

var arc = g.selectAll()
    .data(pie(data))
    .enter()
    .append("g");

arc.append("path")
    .attr("d", path)
    .attr("fill", function(d) { return color(d.data.percentage); });
