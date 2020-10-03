// Import and visualize the dataset
// USGS Earthquake data using the past week's data (note: updates every minute)


// Step 1: Store API url
// ----------------------------------------------------
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


// Step 2: Create size and color functions
// This will determine the size and color of the markers based on the magnitude of the earthquake
// ----------------------------------------------------
function markerSize(mag) {
    return mag * 15000
}

function getColor(d) {
    return d >= 90 ? '#800026':
           d >= 70 ? '#BD0026':
           d >= 50 ? '#E31A1C':
           d >= 30 ? '#FC4E2A':
           d >= 10 ? '#FD8D3C':
                     '#FFEDA0';
}

// Step 3: Perform a GET request to the url
// ----------------------------------------------------
d3.json(url, function (data) {

    // Once we get a response, send the earthquakeData.createFeatures object to the createFeatures function
    createFeatures(data.features);
});


// Step 4: Create features function
// ----------------------------------------------------
function createFeatures(earthquakeData) {

    // Create a GeoJSON layer on the earthquakeData object
    var earthquakes = L.geoJSON(earthquakeData, {

        // Define a function we want to run once for each feature in the features array
        // Give each feature a popup describing the mag[nitude] and place of the earthquake
        onEachFeature: function (feature, layer) {
            layer.bindPopup('<h3> Magnitude: ' + feature.properties.mag + '<br> Location: ' + feature.properties.place + '</h3><hr><p><b> Date: ' + new Date(feature.properties.time) + '<br>' + 'Depth: ' + feature.geometry.coordinates[2] + '</b></p>')
        },

        // Adding pointToLayer for circleMarkers
        pointToLayer: function (feature, latlng) {
            return new L.circle(latlng,
                {
                    radius: markerSize(feature.properties.mag),
                    fillColor: getColor(feature.geometry.coordinates[2]),
                    fillOpacity: 0.5,
                    stroke: true,
                    color: 'black',
                    weight: 0.25
                })
        }
    });

    // Sending earthquakes layer to the createMap function
    createMap(earthquakes);
}


// Step 5: Create map function
// ----------------------------------------------------
function createMap(earthquakes) {

    // Define lightmap and darkmap layers
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        tileSize: 512,
        // maxZoom: 18,
        zoomOffset: -1,
        id: "light-v10",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        tileSize: 512,
        // maxZoom: 18,
        zoomOffset: -1,
        id: "dark-v10",
        accessToken: API_KEY
    });

    // Define baseMaps object to hold base layers
    var baseMaps = {
        'Light Map': lightmap,
        'Dark Map': darkmap
    };

    // Create overlay object to hold overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create map, giving it the lightmap and earthquakes
    var myMap = L.map("mapid", {
        center: [37.0902, -97.7129],
        zoom: 4,
        layers: [lightmap, earthquakes]
    });

    // Create layer control
    // Pass in baseMaps and overlayMaps
    // Add layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);


    // Create legend
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend');
        var depths = [-10, 10, 30, 50, 70, 90];

        var legendHeader = '<h3> Earthquake <br> Depth </h3><hr>'
            div.innerHTML = legendHeader;

        for (var i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' + depths[i] + (depths[i + 1] ? ' - ' + depths[i + 1] + '<br>' : ' + ');
        };

        return div;
    };

    legend.addTo(myMap);
}