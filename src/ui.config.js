

/* scaling variables */
var wHeight = $(window).height();
var wWidth = $(window).width();

var scrollButtonHeight = $(".scroll-button").height();

$(".column").css("height", wHeight);
$(".content").css("height", wHeight-scrollButtonHeight);
/* end scaling variables */


/*detailed information window scrollable */
var scrollable = d3v3.select("#scrollable");

d3v3.select("#down").on('click', function() {
    var scrollheight = scrollable.property("scrollHeight");

    d3v3.select("#scrollable").transition().duration(1000)
        .tween("uniquetweenname", scrollTopTween(scrollheight));
});

d3v3.select("#up").on('click', function() {
    d3v3.select("#scrollable").transition().duration(1000)
        .tween("uniquetweenname", scrollTopTween(0));
});

function scrollTopTween(scrollTop) {
    return function() {
        var i = d3v3.interpolateNumber(this.scrollTop, scrollTop);
        return function(t) { this.scrollTop = i(t); };
    };
}
/*end detailed information window scrollable */
