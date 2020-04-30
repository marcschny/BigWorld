
/** TESTCHART Canvas**/
var margin = {top: 40, right: 40, bottom: 40, left: 40},
    width = document.getElementById("scrollable").clientWidth - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var x = d3v3.scale.ordinal().rangeRoundBands([0, width], .2);

var y = d3v3.scale.linear().range([height, 0]);

var xAxis = d3v3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3v3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3v3.select("#testchart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


/* COUNT Number of countries */
d3v3.csv("./data/obese-worldwide-and-switzerland-final.csv",function(data) {

    // count distinct number of countries
    var male = [];
    var female = [];
    var total = [];
    var countries = [];
    for(var i=0; i<data.length;i++){
        //store all countries in array UNIQUE
        if(countries.indexOf(data[i]["Country"]) === -1 && data[i]["Value"] != ""){
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
    y.domain([d3v3.min(dataTopThreeObese, function(d) { return d.Value-10; }), d3v3.max(dataTopThreeObese, function(d) { return d.Value+10; })]);

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

function getCountryData(country){
    console.log("Country '"+ country +"' clicked");
    var countryData = [];

    allData.then(function (data) {

      /*  data.forEach(function(d,i){
            //get specific country data
            if(d[i].country === country && d[i].gender === "total" && d[i].value !== null
                && (d[i].bmi === "overweight" || d[i].bmi === "obese")) {
                countryData.push(d[i]);
            }
        });*/
        for (var i= 0; i<data.length; i++){
            if (data[i].country === country && data[i].gender === "total" &&
             (data[i].bmi === "overweight" || data[i].bmi === "obese")){
                countryData.push(data[i])
            }
        }
        for (var i=0; i<countryData.length; i++){
                console.log(countryData[i]);

        }


        //sort array desc
        countryData.sort(function(a,b){
            return b.year - a.year;
        });
        //only store value from latest year
        countryData.splice(1);

        //log data of current selected country
        console.log(countryData[0]);

        //pass this data to generate a pie chart
        showPieChart(countryData);
    });

}



function showPieChart(data){

    //check if country has data
    if(!(data.length > 0)){
        document.getElementById("percOfCountry").innerHTML = "";
        alert("no data available");
    }

    //console.log("Value: "+data[0].value);
    var countryData = data;
    var pieValue = data[0].value;
    var rest = 100-data[0].value;
    var year = data[0].year;


    const chartDiv = document.getElementById("percOfCountry");
    //console.log(chartDiv.childNodes.length);



    //check if there is already a pie chart in the div
    if(chartDiv.childNodes.length === 0){
        $("#percOfCountryTitle").text("% der Bevölkerung im Jahr "+year);
        /* TEST Pie Chart */
        var data = [pieValue, rest];

        var width = 300,
            height = 300,
            radius = Math.min(width, height) / 2;

        var svg = d3.select('#percOfCountry').append('svg')
            //select the svg with a class name instead of 'svg.'
            //select the svg with an ID
            .attr("width", 300)
            .attr("height", 300);

        var g = svg.append("g")
            .attr("transform", "translate(" + radius + "," + radius + ")") ;

        var color = d3.scaleOrdinal(["#3386ff", "#ddd"]);

        var pie = d3.pie()
            .sort(null)
            .value(function(d) { return d });

        var path = d3.arc()
            .outerRadius(radius)
            .innerRadius(0);

        var arc = g.selectAll()
            .data(pie(data))
            .enter()
            .append("g");

        arc.append("path")
            .attr("d", path)
            .attr("fill", function(d,i) { return color(d.data); });

        arc.append("text")
            .attr("text-anchor", "middle")
            .attr("class", "chart-label")
            .text(pieValue+"%");

    }else{
        document.getElementById("percOfCountry").innerHTML = "";
        showPieChart(countryData);
    }

}

