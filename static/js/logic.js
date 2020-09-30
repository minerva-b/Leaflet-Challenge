// Import and visualize the dataset
// USGS Earthquake data using the past month's significant data (note: updates every minute)
// URL: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"

// Step 1: Create my map object
var myMap = L.map("map", {
    zoom: 10,
    center: [37.0902, 97.7129]
});

// Step 2: Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// Step X: Perform an API call to the USGS website
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson", function(dataRes) {
    console.log(dataRes);
});

