var currentMap = 0;
var currentWarnings = 0;
var nokToday = false;
var nokTomorrow = false;

var warnClasses = ["NORMAL", "WARN1", "WARN2", "WARN3"];

var TODAY_MAP = 0;
var TOMORROW_MAP = 1;
var AFTERTOMORROW_MAP = 2;

var map;
var maps;

function getChoropleth(haData) {
    data = {};

    for (var haId in haData) {
        var flood = haData[haId].flood;
        var flashflood = haData[haId].flashflood;
        var drought = haData[haId].drought;

        var maxWarn = 0;

        switch (currentWarnings) {
            case 0:
                maxWarn = Math.max(flood, flashflood, drought);
                break;

            case 1:
                maxWarn = flood;
                break;

            case 2:
                maxWarn = flashflood;
                break;

            case 3:
                maxWarn = drought;
                break;
        }


        data[haId] = { fillKey: warnClasses[maxWarn] };
    }

    return data;
}

function updateMap(mapId, data) {
    maps[mapId].updateChoropleth(getChoropleth(data));

    // If we are updating the currently active map, update the large map as well.
    if (currentMap == mapId) {
        map.updateChoropleth(getChoropleth(data));
        map.warning(getWarnings(data));
    }
}

function getWarnings(haData) {
    var warnings = [];

    for (var haId in haData) {
        var flood = haData[haId].flood;
        var flashflood = haData[haId].flashflood;
        var drought = haData[haId].drought;

        var centroid = centroids[haId];

        if ((currentWarnings == 0) || (currentWarnings == 1)) {
            if (flood > 0) {
                warnings.push({lat: centroid.lat, lng: centroid.lng, warn: 'flood' });
            }
        }

        if ((currentWarnings == 0) || (currentWarnings == 2)) {
            if (flashflood > 0) {
                warnings.push({lat: centroid.lat, lng: centroid.lng, warn: 'flashflood' });
            }
        }

        if ((currentWarnings == 0) || (currentWarnings == 3)) {
            if (drought > 0) {
                warnings.push({lat: centroid.lat, lng: centroid.lng, warn: 'drought' });
            }
        }
    }

    return warnings;
}

function updateMaps() {
    updateMap(TODAY_MAP, (nokToday ? ha_today_nok : ha_today_ok));
    updateMap(TOMORROW_MAP, (nokTomorrow ? ha_tomorrow_nok : ha_tomorrow_ok));
    updateMap(AFTERTOMORROW_MAP, ha_aftertomorrow_ok);
}

$(function() {
    map = new Datamap({
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

        data: getChoropleth(ha_today_ok)
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
              return self.latLngToXY(datum.lat, datum.lng)[0] - 8;
            })
            .attr('y', function ( datum ) {
              return self.latLngToXY(datum.lat, datum.lng)[1] - 8;
            })
            .attr('width', 16)
            .attr('height', 16)
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

    // map.warning([
    //     { lat: 46.03, lng:15.3, warn: "flood" },
    //     { lat: 46.55, lng:15.2, warn: "flashflood" },
    //     { lat: 45.75, lng:14.30, warn: "drought" },
    // ]);

    map.warning(getWarnings(ha_today_ok));

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

        data: getChoropleth(ha_today_ok)
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

        data: getChoropleth(ha_tomorrow_ok)
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

        data: getChoropleth(ha_aftertomorrow_ok)
    });

    // Store maps into an array for easier demoing.
    maps = [ smallTodayMap, smallTomorrowMap, smallAfterTomorrowMap ];

    $('.warn_type').click(function() {
        currentWarnings = $(this).data("warn");

        updateMaps();
    });

    $('#small_today').click(function() {
        currentMap = 0;

        map.updateChoropleth((nokToday ? getChoropleth(ha_today_nok) : getChoropleth(ha_today_ok)));
        map.warning(getWarnings(nokToday ? ha_today_nok : ha_today_ok));
    });

    $('#small_tomorrow').click(function() {
        currentMap = 1;

        map.updateChoropleth((nokTomorrow ? getChoropleth(ha_tomorrow_nok) : getChoropleth(ha_tomorrow_ok)));
        map.warning(getWarnings(nokTomorrow ? ha_tomorrow_nok : ha_tomorrow_ok));
    });

    $('#small_after_tomorrow').click(function() {
        currentMap = 2;

        map.updateChoropleth(getChoropleth(ha_aftertomorrow_ok));
        map.warning(getWarnings(ha_aftertomorrow_ok));
    });

    $('#normal_today').click(function() {
        updateMap(TODAY_MAP, ha_today_ok);

        nokToday = false;

    });

    $('#nok_today').click(function() {
        updateMap(TODAY_MAP, ha_today_nok);

        nokToday = true;
    });

    $('#normal_tomorrow').click(function() {
        updateMap(TOMORROW_MAP, ha_tomorrow_ok);
        nokTomorrow = false;
    });

    $('#nok_tomorrow').click(function() {
        updateMap(TOMORROW_MAP, ha_tomorrow_nok);
        nokTomorrow = true;
    });
});

