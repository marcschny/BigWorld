
//if no country selected (worldwide)
if(getCountry() === "Worldwide") {
    document.getElementById("percOfCountryTitle").innerHTML = "Countries with data";
    document.getElementById("percOfDeathsTitle").innerHTML = "Top 3 overweight countries";


    /* COUNT Number of countries */
    allData.then(function(data){

        // count distinct number of countries
        var male = [];
        var female = [];
        var total = [];
        var countries = [];
        for (var i = 0; i<data.length; i++) {
            //store all countries in array UNIQUE
            if (countries.indexOf(data[i].country) === -1 && data[i].value != "" && data[i].value != 0) {
                countries.push(data[i].country);
            }

            //store all data with non-empty values in array
            if(data[i].file === "share-of-adults-who-are-overweight.csv" && data[i].value != "" && data[i].value != 0 && data[i].year === 2016){
                total.push(data[i]);
            }
        }

        console.log("Number of countries: " + countries.length);

        //display number of countries with data
        document.getElementById("percOfCountry").innerHTML = countries.length;


        //get top 3 obese countries
        total.sort(function(a,b){
            return b.value - a.value;
        });
        var dataTopThreeObese = total.slice(0, 3);

        console.log(dataTopThreeObese);

        //draw bar chart
        var margin = {top: 30, right: 30, bottom: 30, left: 40},
            width = 340 - margin.left - margin.right,
            height = 320 - margin.top - margin.bottom;

        var greyColor = "#FFD677";
        var barColor = "#FFD677";
        var highlightColor = "#FFB972";

        var formatPercent = d3.format(".0%");

        var svg = d3.select("#percOfDeaths").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scaleBand()
            .range([0, width])
            .padding(0.15);
        var y = d3.scaleLinear()
            .range([height, 0]);

        var xAxis = d3.axisBottom(x);
        var yAxis = d3.axisLeft(y);

        x.domain(dataTopThreeObese.map( d => {
            return d.country === "United States of America" ? "USA ("+d.year+")" : d.country+" ("+d.year+")";
        }));
        y.domain([d3.min(dataTopThreeObese, function(d) { return d.value-15; }), d3.max(dataTopThreeObese, function(d) { return d.value+10; })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis.tickFormat(function(d){
                return d+"%";
            }).ticks(5));

        svg.selectAll(".bar")
            .data(dataTopThreeObese)
            .enter().append("rect")
            .attr("class", "bar")
            .style("display", d => { return d.value === null ? "none" : null; })
            .style("fill",  d => {
                return d.value === d3.max(dataTopThreeObese,  d => { return d.value; })
                    ? highlightColor : barColor
            })
            .attr("x",  d => { return x(d.country === "United States of America" ? "USA ("+d.year+")" : d.country+" ("+d.year+")"); })
            .attr("width", x.bandwidth())
            .attr("y",  d => { return height; })
            .attr("height", 0)
            .transition()
            .duration(750)
            .delay(function (d, i) {
                return i * 150;
            })
            .attr("y",  d => { return y(d.value); })
            .attr("height",  d => { return height - y(d.value); });

        svg.selectAll(".label")
            .data(dataTopThreeObese)
            .enter()
            .append("text")
            .attr("class", "label")
            .style("display",  d => { return d.value === null ? "none" : null; })
            .attr("x", ( d => { return x(d.country === "United States of America" ? "USA ("+d.year+")" : d.country+" ("+d.year+")") + 18 ; }))
            .style("fill",  d => {
                return d.value === d3.max(dataTopThreeObese,  d => { return d.value; })
                    ? highlightColor : greyColor
            })
            .attr("y",  d => { return height; })
            .attr("height", 0)
            .transition()
            .duration(750)
            .delay((d, i) => { return i * 150; })
            .text( d => { return d.value+"%"; })
            .attr("y",  d => { return y(d.value) + .1; })
            .attr("dy", "-.7em");


    });


}




function getCountryData(country){
    //console.log("Country '"+ country +"' clicked");
    var countryData = [];

    allData.then(function (data) {
        for (var i= 0; i<data.length; i++){
            if (data[i].country === country && data[i].file === "share-of-adults-who-are-overweight.csv"
                /*data[i].gender === "total" && data[i].value !== " " &&
                data[i].bmi === "overweight"*/){
                countryData.push(data[i])
            }
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


//generate pie chart from data
function showPieChart(data){

    //check if country has data
    if(!(data.length > 0)){
        document.getElementById("percOfCountry").innerHTML = "no data available yet";
        document.getElementById("percOfCountryTitle").innerHTML = "Overweight and obese people";
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
        document.getElementById("percOfCountryTitle").innerHTML = "Overweight and obese people in "+year;
        /* TEST Pie Chart */
        var data = [pieValue, rest];

        var width = 260,
            height = 260,
            radius = Math.min(width, height) / 2;

        var svg = d3.select('#percOfCountry').append('svg')
            //select the svg with a class name instead of 'svg.'
            //select the svg with an ID
            .attr("width", 260)
            .attr("height", 260);

        var g = svg.append("g")
            .attr("transform", "translate(" + radius + "," + radius + ")") ;

        var color = d3.scaleOrdinal(["#FFB972", "#ddd"]);

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



