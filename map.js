var currentMap = 0;
var nokToday = false;
var nokTomorrow = false;

function todayData() {
    var data = {};

    for (var i = 1; i <= 26; i++) {
        var cls = "NORMAL";

        if (i < 10) {
            cls = "NORMAL";
        } else if (i < 12) {
            cls = "WARN1";
        } else if (i < 15) {
            cls = "WARN2";
        } else {
            cls = "NORMAL";
        }

        data["ha_" + i.toString()] = { fillKey: cls };
    }

    return data;
}

function tomorrowData() {
    var data = {};

    for (var i = 1; i <= 26; i++) {
        var cls = "NORMAL";

        if (i < 6) {
            cls = "NORMAL";
        } else if (i < 10) {
            cls = "WARN1";
        } else if (i < 15) {
            cls = "WARN3";
        } else if (i < 20) { 
            cls = "WARN2";
        } else {
            cls = "NORMAL";
        }

        data["ha_" + i.toString()] = { fillKey: cls };
    }

    return data;
}

function afterTomorrowData() {
    var data = {};

    for (var i = 1; i <= 26; i++) {
        var cls = "NORMAL";

        if (i < 15) {
            cls = "NORMAL";
        } else if (i < 17) {
            cls = "WARN1";
        } else {
            cls = "NORMAL";
        }

        data["ha_" + i.toString()] = { fillKey: cls };
    }

    return data;
}

function nokTodayData() {
    var data = {};

    for (var i = 1; i <= 26; i++) {
        var cls = "NORMAL";

        if (i < 15) {
            cls = "WARN3";
        } else if (i < 17) {
            cls = "WARN2";
        } else {
            cls = "WARN3";
        }

        data["ha_" + i.toString()] = { fillKey: cls };
    }

    return data;
}

function nokTomorrowData() {
    var data = {};

    for (var i = 1; i <= 26; i++) {
        var cls = "NORMAL";

        if (i < 12) {
            cls = "WARN3";
        } else if (i < 20) {
            cls = "WARN2";
        } else {
            cls = "WARN3";
        }

        data["ha_" + i.toString()] = { fillKey: cls };
    }

    return data;
}


$(function() {
    var map = new Datamap({
        element: document.getElementById('container'),

        geographyConfig: {
            dataUrl: 'ha_obmocja_vvode.json',
            popupTemplate: function(geo, data) {
                return ['<div class="hoverinfo"><strong>' + geo.properties.name + '</strong>',
                        '<br/>' + data.fillKey,
                        '</div>'].join('');
            },
        },

        scope: 'ha_obmocja_vvode',

        setProjection: function(element, options) {
            projection = d3.geo.mercator()
                .center([14.9,46.15])
                .translate([element.offsetWidth / 2, element.offsetHeight / 2])
                .scale(11000);

            var path = d3.geo.path()
                .projection( projection );

            return {path: path, projection: projection};
        },

        fills: {
            NORMAL: 'green',
            WARN1: 'yellow',
            WARN2: 'orange',
            WARN3: 'red',
            defaultFill: 'green'
        },

        data: todayData()
    });

    map.legend();

    var smallTodayMap = new Datamap({
        element: document.getElementById('small_today_map'),

        geographyConfig: {
            dataUrl: 'ha_obmocja_vvode.json',
            popupOnHover: false, //disable the popup while hovering
            highlightOnHover: false,
        },

        scope: 'ha_obmocja_vvode',

        setProjection: function(element, options) {
            projection = d3.geo.mercator()
                .center([14.9,46.15])
                .translate([element.offsetWidth / 2, element.offsetHeight / 2])
                .scale(3500);

            var path = d3.geo.path()
                .projection( projection );

            return {path: path, projection: projection};
        },

        fills: {
            WARN3: 'red',
            WARN2: 'orange',
            WARN1: 'yellow',
            NORMAL: 'green',
            defaultFill: 'green'
        },

        data: todayData()
    });

    var smallTomorrowMap = new Datamap({
        element: document.getElementById('small_tomorrow_map'),

        geographyConfig: {
            dataUrl: 'ha_obmocja_vvode.json',
            popupOnHover: false, //disable the popup while hovering
            highlightOnHover: false,
        },

        scope: 'ha_obmocja_vvode',

        setProjection: function(element, options) {
            projection = d3.geo.mercator()
                .center([14.9,46.15])
                .translate([element.offsetWidth / 2, element.offsetHeight / 2])
                .scale(3500);

            var path = d3.geo.path()
                .projection( projection );

            return {path: path, projection: projection};
        },

        fills: {
            WARN3: 'red',
            WARN2: 'orange',
            WARN1: 'yellow',
            NORMAL: 'green',
            defaultFill: 'green'
        },

        data: tomorrowData()
    });

    var smallAfterTomorrowMap = new Datamap({
        element: document.getElementById('small_after_tomorrow_map'),

        geographyConfig: {
            dataUrl: 'ha_obmocja_vvode.json',
            popupOnHover: false, //disable the popup while hovering
            highlightOnHover: false,
        },

        scope: 'ha_obmocja_vvode',

        setProjection: function(element, options) {
            projection = d3.geo.mercator()
                .center([14.9,46.15])
                .translate([element.offsetWidth / 2, element.offsetHeight / 2])
                .scale(3500);

            var path = d3.geo.path()
                .projection( projection );

            return {path: path, projection: projection};
        },

        fills: {
            WARN3: 'red',
            WARN2: 'orange',
            WARN1: 'yellow',
            NORMAL: 'green',
            defaultFill: 'green'
        },

        data: afterTomorrowData()
    });

    $('#small_today').click(function() {
        map.updateChoropleth((nokToday ? nokTodayData() : todayData()));
        currentMap = 0;
    });

    $('#small_tomorrow').click(function() {
        map.updateChoropleth((nokTomorrow ? nokTomorrowData() : tomorrowData()));
        currentMap = 1;
    });

    $('#small_after_tomorrow').click(function() {
        map.updateChoropleth(afterTomorrowData());
        currentMap = 2;
    });

    $('#normalno_today').click(function() {
        nokToday = false;
        smallTodayMap.updateChoropleth(todayData());
        if (currentMap == 0) {
            map.updateChoropleth(todayData());
        }
    });

    $('#nok_today').click(function() {
        nokToday = true;
        smallTodayMap.updateChoropleth(nokTodayData());
        if (currentMap == 0) {
            map.updateChoropleth(nokTodayData());
        }
    });

    $('#normalno_tomorrow').click(function() {
        nokTomorrow = false;
        smallTomorrowMap.updateChoropleth(tomorrowData());
        if (currentMap == 1) {
            map.updateChoropleth(tomorrowData());
        }
    });

    $('#nok_tomorrow').click(function() {
        nokTomorrow = true;
        smallTomorrowMap.updateChoropleth(nokTomorrowData());
        if (currentMap == 1) {
            map.updateChoropleth(nokTomorrowData());
        }
    });
});

