/* load data from csv file */


var allData = d3.csv("data/obese-worldwide-and-switzerland-final.csv", function (d) {
    return {
        country: d.Country,
        year: +d.Year,
        bmi: d.BMI,
        gender: d.Gender,
        age: d.Age,
        value: +d.Value,
        state: d.State,
        numberOfPersons: d.NumberOfPersons,
        deaths: +d.Deaths
    };
});

//zugriff auf die daten
allData.then(function (data) {
    //console.log(data[3433].country);
    //getAllRows
    //console.log(data.length)
});


