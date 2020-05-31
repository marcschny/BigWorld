
/* load data from csv file */
var allData = d3.csv("data/obese-worldwide-data-final.csv", function (d) {
    return {
        file: d.File,
        country: d.Country,
        year: +d.Year,
        bmi_men: +d.BMIMen,
        bmi_women: +d.BMIWomen,
        value: +d.Value,
        deaths: +d.Deaths
};
});

var caloriesData = d3.csv("data/food-supply-kcal.csv", function (d) {
    return {
        country: d.Country,
        year: +d.Year,
        calories: +d.Calories
    };

});



