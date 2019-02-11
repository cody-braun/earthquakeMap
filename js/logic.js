function createMap(earthquakes) {

  // Create the tile layer that will be the background of our map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  // Initialize all of the LayerGroups we'll be using
  var layers = {
    EARTHQUAKES: earthquakes
  };

  // Create the map with our layers
  var map = L.map("map-id", {
    center: [40,-100],
    zoom: 5,
    layers: [
      layers.EARTHQUAKES
    ]
  });

  // Add our 'lightmap' tile layer to the map
  lightmap.addTo(map);

  // Create an overlays object to add to the layer control
  var overlays = {
    "Earthquakes": layers.EARTHQUAKES
  };

  // Create a control for our layers, add our overlay layers to it
  L.control.layers(null, overlays, {collapsed: false}).addTo(map);

  // Create a legend to display information about our map
  var info = L.control({
    position: "bottomright"
  });

  // When the layer control is added, insert a div with the class of "legend"
  info.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var colors = ['#ffffe0','#ffcb91','#fe906a','#e75758','#c0223b','#8b0000'];
    var limits = ["0-1","1-2","2-3","3-4","4-5","5+"];

    colors.forEach(function(color, index) {
      div.innerHTML += '<i style="background:' + colors[index] + '"></i> ' + limits[index] + "<br>";
    });

    return div;
  };
  // Add the info legend to the map
  info.addTo(map);
};

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson", function(data) {
  createFeatures(data.features);
});

function createFeatures(data){

  function onEachFeature(feature, layer) {
    layer.bindPopup("<h2>" + feature.properties.place +
      "</h2><hr><h3> Magnitude  " + feature.properties.mag +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }
  
  function getFill(mag) {
    return mag > 5 ? "#8b0000" :
           mag > 4 ? "#c0223b" :
           mag > 3 ? "#e75758" :
           mag > 2 ? "#fe906a" :
           mag > 1 ? "#ffcb91" :
                     "#ffffe0";
  };

  function getRadius(mag) {
    return mag*10;
  };

  var earthquakes = L.geoJSON(data, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {radius: getRadius(feature.properties.mag),
                                      fillOpacity: 0.8,
                                      fillColor: getFill(feature.properties.mag),
                                      color: 'black',
                                      weight: 1});
    }
  });

  createMap(earthquakes);

};
