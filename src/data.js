/* load data from csv file */
var data =d3.csv("./data/obese-worldwide-and-switzerland-final.csv")
    .row(function (d) {
        return {
            country: d.Country,
            year: new Date(+d.Year),
            bmi: d.BMI,
            gender: d.Gender,
            age: d.Age,
            value: +d.Value,
            state: d.State,
            numberOfPersons: d.NumberOfPersons,
            deaths: +d.Deaths
        };
    });
