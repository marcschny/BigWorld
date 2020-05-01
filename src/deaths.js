
function getDeathsData (country) {

    var deathData = [];

    allData.then(function (data) {

        for (var i = 0; i < data.length; i++) {
            if (data[i].country === country && data[i].file === "deaths-by-obesity-clean.csv") {
                deathData.push(data[i]);
            }
        }
        //sort array desc
        deathData.sort(function(a,b){
            return b.year - a.year;
        });
        //only store value from latest year
        deathData.splice(1);

        showDeathPerc(deathData);

    });
}

function showDeathPerc(data) {
    var year = data[0].year;
    var deaths = data[0].deaths;

    const percOfDeaths = document.getElementById("percOfDeaths");

    if (percOfDeaths.childNodes.length === 0) {
        $("#percOfDeathsTitle").text("Deaths in " + year + " attributable to obesity");
    }

    d3.select("#percOfDeaths").html(
        '<div>' +
        '   <div style="float: left; width: 60%; ">' +
        '       <div class="deathsText">'+ deaths + '%</div> ' +
        '   </div> ' +
        '   <div style="float: right; width: 40%">' +
        '       <img class="coffin" src="img/icons/coffin.svg"> ' +
        '   </div> ' +
        '</div>')
}

