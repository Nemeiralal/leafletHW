// Creating map object
const map = L.map("map", {
    center: [40.7128, -74.0059],
    zoom: 11
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
}).addTo(map);

const link1 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
console.log(link1)
const link2 = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
console.log(link2)

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