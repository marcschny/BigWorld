
/* load data from csv file */
var allData = d3.csv("data/obese-worldwide-data-final2.csv", function (d) {
    return {
        file: d.File,
        country: d.Country,
        year: +d.Year,
        bmi_men: +d.BMIMen,
        bmi_women: +d.BMIWomen,
        daily_calories: d.DailyCalories,
        value_calories: d.ValueCalories,
        value: +d.Value,
        deaths: +d.Deaths
};
});

//zugriff auf die daten
// allData.then(function (data) {
//     console.log(data[3433].country);
//     //getAllRows
//     console.log(data.length)
// });


