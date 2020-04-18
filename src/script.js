/*detailed information window scrollable */
var scrollable = d3.select("#scrollable");

d3.select("#down").on('click', function() {
    var scrollheight = scrollable.property("scrollHeight");

    d3.select("#scrollable").transition().duration(1000)
        .tween("uniquetweenname", scrollTopTween(scrollheight));
});

d3.select("#up").on('click', function() {
    d3.select("#scrollable").transition().duration(1000)
        .tween("uniquetweenname", scrollTopTween(0));
});

function scrollTopTween(scrollTop) {
    return function() {
        var i = d3.interpolateNumber(this.scrollTop, scrollTop);
        return function(t) { this.scrollTop = i(t); };
    };
}

/* load data from csv file */
d3.csv("./data/obese-worldwide-and-switzerland-final.csv")
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

/* WORLD MAP */

function Zoom(args) {
    $.extend(this, {
        $buttons:   $(".zoom-button"),
        $info:      $("#zoom-info"),
        scale:      { max: 50, currentShift: 0 },
        $container: args.$container,
        datamap:    args.datamap
    });

    this.init();
}

Zoom.prototype.init = function() {
    var paths = this.datamap.svg.selectAll("path"),
        subunits = this.datamap.svg.selectAll(".datamaps-subunit");

    // preserve stroke thickness
    paths.style("vector-effect", "non-scaling-stroke");

    // disable click on drag end
    subunits.call(
        d3.behavior.drag().on("dragend", function() {
            d3.event.sourceEvent.stopPropagation();
        })
    );

    this.scale.set = this._getScalesArray();
    this.d3Zoom = d3.behavior.zoom().scaleExtent([ 1, this.scale.max ]);

    this._displayPercentage(1);
    this.listen();
};

Zoom.prototype.listen = function() {
    this.$buttons.off("click").on("click", this._handleClick.bind(this));

    this.datamap.svg
        .call(this.d3Zoom.on("zoom", this._handleScroll.bind(this)))
        .on("dblclick.zoom", null); // disable zoom on double-click
};

// reset button tbd
/*Zoom.prototype.reset = function() {
    this._shift("reset");
};*/

Zoom.prototype._handleScroll = function() {
    var translate = d3.event.translate,
        scale = d3.event.scale,
        limited = this._bound(translate, scale);

    this.scrolled = true;

    this._update(limited.translate, limited.scale);
};

Zoom.prototype._handleClick = function(event) {
    var direction = $(event.target).data("zoom");

    this._shift(direction);
};

Zoom.prototype._shift = function(direction) {
    var center = [ this.$container.width() / 2, this.$container.height() / 2 ],
        translate = this.d3Zoom.translate(), translate0 = [], l = [],
        view = {
            x: translate[0],
            y: translate[1],
            k: this.d3Zoom.scale()
        }, bounded;

    translate0 = [
        (center[0] - view.x) / view.k,
        (center[1] - view.y) / view.k
    ];

    if (direction == "reset") {
        view.k = 1;
        this.scrolled = true;
    } else {
        view.k = this._getNextScale(direction);
    }

    l = [ translate0[0] * view.k + view.x, translate0[1] * view.k + view.y ];

    view.x += center[0] - l[0];
    view.y += center[1] - l[1];

    bounded = this._bound([ view.x, view.y ], view.k);

    this._animate(bounded.translate, bounded.scale);
};

Zoom.prototype._bound = function(translate, scale) {
    var width = this.$container.width(),
        height = this.$container.height();

    translate[0] = Math.min(
        (width / height)  * (scale - 1),
        Math.max( width * (1 - scale), translate[0] )
    );

    translate[1] = Math.min(0, Math.max(height * (1 - scale), translate[1]));

    return { translate: translate, scale: scale };
};

Zoom.prototype._update = function(translate, scale) {
    this.d3Zoom
        .translate(translate)
        .scale(scale);

    this.datamap.svg.selectAll("g")
        .attr("transform", "translate(" + translate + ")scale(" + scale + ")");

    this._displayPercentage(scale);
};

Zoom.prototype._animate = function(translate, scale) {
    var _this = this,
        d3Zoom = this.d3Zoom;

    d3.transition().duration(350).tween("zoom", function() {
        var iTranslate = d3.interpolate(d3Zoom.translate(), translate),
            iScale = d3.interpolate(d3Zoom.scale(), scale);

        return function(t) {
            _this._update(iTranslate(t), iScale(t));
        };
    });
};

Zoom.prototype._displayPercentage = function(scale) {
    var value;

    value = Math.round(Math.log(scale) / Math.log(this.scale.max) * 100);
    this.$info.text(value + "%");
};

Zoom.prototype._getScalesArray = function() {
    var array = [],
        scaleMaxLog = Math.log(this.scale.max);

    for (var i = 0; i <= 10; i++) {
        array.push(Math.pow(Math.E, 0.1 * i * scaleMaxLog));
    }

    return array;
};

Zoom.prototype._getNextScale = function(direction) {
    var scaleSet = this.scale.set,
        currentScale = this.d3Zoom.scale(),
        lastShift = scaleSet.length - 1,
        shift, temp = [];

    if (this.scrolled) {

        for (shift = 0; shift <= lastShift; shift++) {
            temp.push(Math.abs(scaleSet[shift] - currentScale));
        }

        shift = temp.indexOf(Math.min.apply(null, temp));

        if (currentScale >= scaleSet[shift] && shift < lastShift) {
            shift++;
        }

        if (direction == "out" && shift > 0) {
            shift--;
        }

        this.scrolled = false;

    } else {

        shift = this.scale.currentShift;

        if (direction == "out") {
            shift > 0 && shift--;
        } else {
            shift < lastShift && shift++;
        }
    }

    this.scale.currentShift = shift;

    return scaleSet[shift];
};

// create Datamap
function Datamap() {
    this.$container = $("#container");
    this.instance = new Datamaps({
        element: document.getElementById('container'),
        fills: {
            defaultFill: 'rgba(200,200,200,0.9)' // Any hex, color name or rgb/rgba value
        },
        projection: 'mercator',
        done: this._handleMapReady.bind(this)
    });
}

Datamap.prototype._handleMapReady = function(datamap) {
    this.zoom = new Zoom({
        $container: this.$container,
        datamap: datamap
    });
}

new Datamap();

/* END WORLD MAP */









/* TEST Pie Chart */


var w = 300,                            //width
    h = 300,                            //height
    r = 100,                            //radius
    color = d3.scale.category20c();     //builtin range of colors

data = [{"label":"one", "value":20},
    {"label":"two", "value":50},
    {"label":"three", "value":30}];

var vis = d3.select("#testpie")
    .append("svg:svg")              //create the SVG element inside the <body>
    .data([data])                   //associate our data with the document
    .attr("width", w)           //set the width and height of our visualization (these will be attributes of the <svg> tag
    .attr("height", h)
    .append("svg:g")                //make a group to hold our pie chart
    .attr('transform', 'translate(' + w/2 +  ',' + h/2 +')');  //move the center of the pie chart from 0, 0 to radius, radius

var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
    .outerRadius(r);

var pie = d3.layout.pie()           //this will create arc data for us given a list of values
    .value(function(d) { return d.value; });    //we must tell it out to access the value of each element in our data array

var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
    .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
    .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
    .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
    .attr("class", "slice");    //allow us to style things in the slices (like text)

arcs.append("svg:path")
    .attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
    .attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function

arcs.append("svg:text")                                     //add a label to each slice
    .attr("transform", function(d) {                    //set the label's origin to the center of the arc
        //we have to make sure to set these before calling arc.centroid
        d.innerRadius = 0;
        d.outerRadius = r;
        return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
    })
    .attr("text-anchor", "middle")                          //center the text on it's origin
    .text(function(d, i) { return data[i].label; });        //get the label from our ori
