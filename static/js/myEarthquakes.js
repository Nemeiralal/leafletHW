const link1 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
    //console.log(link1)
const link2 = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
    //console.log(link2)

// Grabbing our GeoJSON data..
(async function() {
    const EQ_data = await d3.json(link1);
    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(EQ_data).addTo(map);
})()
(async function() {
    const Plate_data = await d3.json(link2);
    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(Plate_data).addTo(map);
})()

function marker(magnitude) {
    return magnitude * 4;
};

var earthquakes = new L.LayerGroup();
var plateBoundary = new L.LayerGroup();

d3.json(EQ_data, function(geoJson) {
    L.geoJSON(geoJson.features, {
        pointToLayer: function(geoJsonPoint, latlng) {
            return L.circleMarker(latlng, { radius: marker(geoJsonPoint.properties.mag) });
        },

        style: function(geoJsonFeature) {
            return {
                fillColor: ColorRating(geoJsonFeature.properties.mag),
                fillOpacity: 0.7,
                weight: 0.1,
                color: 'blue'

            }
        },

        onEachFeature: function(feature, layer) {
            layer.bindPopup(
                "<h4 style='text-align:center;'>" + new Date(feature.properties.time) +
                "</h4> <hr> <h5 style='text-align:center;'>" + feature.properties.title + "</h5>");
        }
    }).addTo(earthquakes);
    createMap(earthquakes);
});

d3.json(Plate_data, function(geoJson) {
    L.geoJSON(geoJson.features, {
        style: function(geoJsonFeature) {
            return {
                weight: 2,
                color: 'magenta'
            }
        },
    }).addTo(plateBoundary);
})



function createMap() {
    var streetMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 15,
        id: 'mapbox.streets',
        accessToken: API_KEY
    });

    var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 15,
        id: 'mapbox.satellite',
        accessToken: API_KEY
    });

    var darkMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 15,
        id: 'mapbox.dark',
        accessToken: API_KEY
    });

    var highCntrstMp = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 15,
        id: 'mapbox.high-contrast',
        accessToken: API_KEY
    });

    var baseLayers = {
        "Satellite": satellite,
        "Street": streetMap,
        "High Contrast": highCntrstMp,
        "Dark": darkMap
    };
    // my map container bin
    var myEQmap = L.map('myEQmap', {
        center: [36.7783, -119.4179],
        zoom: 4,
        layers: [satellite, earthquakes, plateBoundary]
    });
    // determining overlays from two data sources
    var overlays = {
        "Plate Boundaries": plateBoundary,
        "Earthquakes": earthquakes,
    };


    // adding layers to my EQmap
    L.control.layers(baseLayers, overlays).addTo(myEQmap);

    // legend showing color mapped magnitudes
    var legend = L.control({ position: 'bottomleft' });

    legend.onAdd = function(map) {

        var div = L.DomUtil.create('div', 'info legend'),
            magnitude = [0, 1, 2, 3, 4, 5],
            labels = [];

        div.innerHTML += "<h3 style='margin:4px'>Magnitude</h3>"

        for (var i = 0; i < magnitude.length; i++) {
            div.innerHTML +=
                '<i style="background:' + ColorRating(magnitude[i] + 1) + '"></i> ' +
                magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
        }

        return div;
    };
    legend.addTo(myEQmap);
};

function ColorRating(magnitude) {
    if (magnitude > 5) {
        return 'red'
    } else if (magnitude > 4) {
        return 'orange'
    } else if (magnitude > 3) {
        return 'tan'
    } else if (magnitude > 2) {
        return 'yellow'
    } else if (magnitude > 1) {
        return 'darkgreen'
    } else {
        return 'lightgreen'
    }
}