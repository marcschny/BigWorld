
function getDeathsData (country) {

    var deathData = [];

    allData.then(function (data) {

        for (var i = 0; i < data.length; i++) {
            if (data[i].country === country && data[i].file === "share-of-deaths-obesity.csv") {
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

    //check if country has data
    if(!(data.length > 0)){
        document.getElementById("percOfDeaths").innerHTML = "no data available yet";
        document.getElementById("percOfDeathsTitle").innerHTML = "Deaths attributable to obesity";
    }
    document.getElementById("percOfDeathsTitle").innerHTML = "Deaths in " + year + " attributable to obesity";


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

