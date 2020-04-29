
/** TESTCHART Canvas**/
var margin = {top: 40, right: 40, bottom: 40, left: 40},
    width = document.getElementById("scrollable").clientWidth - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var x = d3.scale.ordinal().rangeRoundBands([0, width], .2);

var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("#testchart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


/* COUNT Number of countries */
d3.csv("./data/obese-worldwide-and-switzerland-final.csv",function(data) {

    // count distinct number of countries
    var male = [];
    var female = [];
    var total = [];
    var countries = [];
    for(var i=0; i<data.length;i++){
        //store all countries in array UNIQUE
        if(countries.indexOf(data[i]["Country"]) === -1){
            countries.push(data[i]["Country"]);
        }
        //store data by gender
        if(data[i]["Gender"] === "male"){
            male.push(data[i]);
        }else if(data[i]["Gender"] === "female"){
            female.push(data[i]);
        }else if(data[i]["Gender"] === "total"){
            total.push(data[i]);
        }
    }
    console.log("Number of countries: "+countries.length);
    $("#countCountries").html(countries.length);



    /** TESTCHART show top three obese countries **/
    var dataTopThreeObese = getTopThreeObese(total);

    x.domain(dataTopThreeObese.map(function(d) { return d.Country+" ("+d.Year+")"; }));
    y.domain([d3.min(dataTopThreeObese, function(d) { return d.Value-10; }), d3.max(dataTopThreeObese, function(d) { return d.Value+10; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "middle")
        .attr("dy", "0.8em");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis.tickFormat(function(d){
            return d+"%";
        })
        .ticks(5))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("dy", "-3em")
        .style("text-anchor", "middle");

    svg.selectAll("bar")
        .data(dataTopThreeObese)
        .enter().append("rect")
        .style("fill", "steelblue")
        .attr("x", function(d) { return x(d.Country); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.Value); })
        .attr("height", function(d) { return height - y(d.Value); });


});



// get top 3 obese countries
function getTopThreeObese(data){
    data.sort(function(a,b){
        return b.Value - a.Value;
    });
    return data.slice(0, 3);
}



