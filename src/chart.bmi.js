function getBMIData(country) {
    var bmiDataMen = [];
    var bmiDataWomen = [];

    allData.then(function (data) {
        for (var i=0; i<data.length; i++){
            if (data[i].country === country && data[i].year === 2016 &&
                data[i].file === "mean-body-mass-index-bmi-in-adult-males.csv") {
                bmiDataMen.push(data[i])
            } else if (data[i].country === country && data[i].year === 2016 &&
                    data[i].file === "mean-body-mass-index-bmi-in-adult-women.csv" ){
                bmiDataWomen.push(data[i])
            }
                }

        showBMIChart(bmiDataMen, bmiDataWomen);
    });

}

function showBMIChart(dataMen, dataWomen) {
    if (!(dataMen.length > 0 && dataWomen.length > 0)) {
        document.getElementById("bmiOfGender").innerHTML = "no data available yet";
        document.getElementById("bmiOfGenderTitle").innerHTML = "Average BMI of men and women in 2016";
    }

    console.log("Men: " + dataMen[0].bmi_men);
    console.log("Woman: " + dataWomen[0].bmi_women);

    const chartBmi = document.getElementById("bmiOfGender");

    if (chartBmi.childNodes.length === 0) {
        document.getElementById("bmiOfGenderTitle").innerHTML = "Average BMI of men and women in 2016";

        console.log(chartBmi.childNodes.length);

        var bmiData = [{
            "gender": "Women",
            "value": dataWomen[0].bmi_women
        },
            {
                "gender": "Men",
                "value": dataMen[0].bmi_men
            }];
        //draw bar chart
        var margin = {top: 30, right: 30, bottom: 30, left: 60},
            width = 340 - margin.left - margin.right,
            height = 100 - margin.top - margin.bottom;


        var maxColor = "#FFB972";
        var minColor = "#FFD677";
        var textColor = "#FFFFFF";
        var formatDecimal = d3.format(".4n");


        var svg = d3.select("#bmiOfGender").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scaleLinear()
            .range([16, width])
            .domain([16,36]);

        var y = d3.scaleOrdinal()
            //.rangeRoundBands([height, 0], .1)
            .range([0, height])
            .domain(bmiData.map(function (d) {
                return d.gender;
            }));

        //labels yAxis with Men and Women
        var yAxis = d3.axisLeft()
            .scale(y)
            .tickSize(0);

        var gy = svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);


        var bars = svg.selectAll(".bar")
            .data(bmiData)
            .enter()
            .append("g");

        //bar rectangles
        bars.append("rect")
            .attr("class", "bar")
            .attr("y", function (d) {
                return y(d.gender);
            })
            .attr("height", 30)
            .attr("x", 0)
            .style("fill", d => {
                return d.value === d3.max(bmiData, d => {return d.value})
                ? maxColor : minColor
            })
            .transition()
            .delay(function(d, i) {
                return i * 150;
            })
            .duration(750)
            .attr("width", function (d)  {
                return x(d.value);
            });


        // value label to the end of the bar
        bars.append("text")
            .attr("class", "label")
            .attr("y", function (d) {
                return y(d.gender) + 30 / 2 + 6;
            })
            .text(function (d) {
                return formatDecimal(d.value);
            })
            .style("fill", textColor)
            .transition()
            .delay(function(d, i) {
                return i * 150;
            })
            .duration(750)
            .attr("x", function (d) {
            return x(d.value) - 40;
            })



    } else {
        document.getElementById("bmiOfGender").innerHTML = "";
        showBMIChart(dataMen, dataWomen);
    }
}
