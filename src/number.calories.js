function getCaloriesData(country) {

    var kcalData = [];

    caloriesData.then(function (data) {
        for (var i=0; i<data.length; i++){
            if (data[i].country === country && data[i].year === 2016){
                kcalData.push(data[i])
            }
        }

        showCalories(kcalData)
    })

}

function showCalories(data) {

//check if country has data
    if (!(data.length > 0)) {
        document.getElementById("caloriesNumber").innerHTML = "no data available yet";
        document.getElementById("caloriesNumberTitle").innerHTML = "Average calorie intake per capita";
    }
    var year = data[0].year;
    var calories = data[0].calories;

    document.getElementById("caloriesNumberTitle").innerHTML = "Average calorie intake per capita in " + year;

    console.log(data.length);




    d3.select("#caloriesNumber").html(
        '<div>' +
        '   <div style="float: left; width: 60%; ">' +
        '       <div class="caloriesText">'+ calories + '</div>' +
        '   </div> ' +
        '   <div style="float: right; width: 40%">' +
        '       <img class="calories" src="img/icons/calories.svg"> ' +
        '   </div> ' +
        '</div>')
}
