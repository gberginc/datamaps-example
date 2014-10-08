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

    map.addPlugin('warning', function ( layer, data ) {  
        // hold this in a closure
        var self = this;

        // a class you'll add to the DOM elements
        var className = 'warning';

        // Clear any previous symbols.
        layer.selectAll("*")
            .remove();

        // make a D3 selection.
        var warnings = layer
               .selectAll(className)
               .data( data, JSON.stringify );

        warnings
          .enter()
            .append('svg:image')
            .attr('class', className)
            .attr('x', function ( datum ) {
              return self.latLngToXY(datum.lat, datum.lng)[0] - 12;
            })
            .attr('y', function ( datum ) {
              return self.latLngToXY(datum.lat, datum.lng)[1] - 12;
            })
            .attr('width', 24)
            .attr('height', 24)
            .attr('xlink:href', function(datum) {
                switch (datum.warn) {
                    case "flood":
                        return "res/flood.png";

                    case "flashflood":
                        return "res/flashflood.png"

                    case "drought":
                        return "res/drought.png";
                }
            })
            // .attr('r', 10);
    });

    map.warning([
        { lat: 46.03, lng:15.3, warn: "flood" },
        { lat: 46.55, lng:15.2, warn: "flashflood" },
        { lat: 45.75, lng:14.30, warn: "drought" },

    ]);

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

    $('#normal_today').click(function() {
        nokToday = false;
        smallTodayMap.updateChoropleth(todayData());
        if (currentMap == 0) {
            map.updateChoropleth(todayData());
        }

        map.warning([
            { lat: 46.03, lng:15.3, warn: "flood" },
            { lat: 46.55, lng:15.2, warn: "flashflood" },
            { lat: 45.75, lng:14.30, warn: "drought" },
        ]);
    });

    $('#nok_today').click(function() {
        nokToday = true;
        smallTodayMap.updateChoropleth(nokTodayData());
        if (currentMap == 0) {
            map.updateChoropleth(nokTodayData());
        }

        map.warning([
            { lat: 46.03, lng:15.3, warn: "flashflood" },
            { lat: 46.55, lng:15.2, warn: "flashflood" },
            { lat: 45.75, lng:14.30, warn: "flashflood" },
            { lat: 46.369746548087065, lng: 15.609914255874894, warn: 'flood' },
        ]);
    });

    $('#normal_tomorrow').click(function() {
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

