// Import and visualize the dataset
// USGS Earthquake data using the past month's significant data (note: updates every minute)

// Step 1: Store API url
// ----------------------------------------------------
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"


// Step 2: Perform a GET request to the url
// ----------------------------------------------------
d3.json(url, function(earthquakeData) {

    // Once we get a response, send the earthquakeData.createFeatures object to the createFeatures function
    createFeatures(earthquakeData.createFeatures);
    
    // Print data
    console.log(earthquakeData);

    // // Creating a marker cluster group
    // var earthquakeMarkers = L.markerClusterGroup();

    // // Loop through data
    // for (var i = 0; i < earthquakeData[i].features; i++) {

    //     // Set the data features property to a variable
    //     var features = earthquakeData[i].features;

    //     // Check for features property
    //     if (features) {

    //         // Add a new marker to the cluster group and bind a pop-up
    //         earthquakeMarkers.addLayer(L.marker([features.properties[0], features.properties[0]]).bindPopup(earthquakeData[i].descriptor));
    //     }
    // }
     
    // // Add our marker cluster layer to the map
    // myMap.addLayer(markers);
});


// Step 3: Create an empty array to store eqData for circles
// ----------------------------------------------------
var eqCircles = [];

// Loop through data
for (var i = 0; i < earthquakeData.length; i++) {
    // Loop through the earthquakes, create a new circle, push it to the eqCircles array
    eqCircles.push(
        L.circle(earthquakeData[i].geometry.coordinates.slice(0, 2).reverse(), {
            color: 'red',
            fillColor: 'white',
            fillOpacity: 0.5//,
            // radius: earthquakeData[i].properties.mag * 5000
        }).bindPopup('<h1>' + earthquakeData[i].place + '</h1>')
    );
}

// Add all eqCircles to a new layer group (now we can handle them as a group vs individuals)
var eqLayer = L.layerGroup(eqCircles);

    // Print circle data
    console.log(eqCircles);


// Step 4: Create features function
// ----------------------------------------------------
function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the mag[nitude] and place of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup('<h3> Magnitude: ' + feature.properties.mag + '<br> Place: ' + feature.properties.place + '</h3><hr><p> Date: ' + new Date(feature.properties.time) + '</p>');
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature
    });

    // Sending earthquakes layer to the createMap function
    createMap(earthquakes);
}


// Step 5: Create map function
// ----------------------------------------------------
function createMap(earthquakes) {

    // Define lightmap and darkmap layers
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "light-v10",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        tileSize: 512,
        maxZoom: 18,
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
        center: [37.0902, 97.7129],
        zoom: 10,
        layers: [lightmap, earthquakes]
    });

    // Create layer control
    // Pass in baseMaps and overlayMaps
    // Add layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

}


// Step 6: Create size and color functions
// This will determine the size and color of the markers based on the magnitude of the earthquake
// ----------------------------------------------------
function markerSize(mag) {
    return mag * 5000
}

function markerColor(mag) {
    if (mag <= 1) {
        // white
        return "#FFFFFF";
    } else if (mag <= 2) {
        // light yellow
        return "#FFFF99";
    } else if (mag <= 3) {
        // yellow-orange
        return "#FFCC00";
    } else if (mag <= 4) {
        // dark orange
        return "#FF6600";
    } else if (mag <= 5) {
        // bright red
        return "#FF0000";
    } else if (mag <= 6) {
        // deep red
        return "#993300";
    };

}
