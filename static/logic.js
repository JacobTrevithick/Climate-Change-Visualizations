





function createMap(markerLayer, countryLayer) {

    // Create the tile layer that will be the background of our map.
    var streetMapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });    

    var satelliteLayer = L.tileLayer.provider('MapBox', {
        id: 'mapbox/satellite-v9',
        accessToken: 'pk.eyJ1IjoiamFjb2J0cmV2aXRoaWNrMSIsImEiOiJja3c2eG45bjgzNGtoMnZwYXRnYjJzNGttIn0.3qRI1UQUwRpCWWo_uFk1Tw'
    });
    

    var myMap = L.map('map', {
        center: mapCenter,
        zoom: mapZoom,
        layers: [streetMapLayer, markerLayer, topoLayer, plateLayer, satelliteLayer]
    });

    var baseMap = {
        "Street Map": streetMapLayer,
        "Topographical Map": topoLayer,
        "Satellite Map": satelliteLayer
    };

    var earthquakeOverlayMap = {
        "Earthquakes": markerLayer,
        "Tectonic Plates": plateLayer
    };

    L.control.layers(baseMap, earthquakeOverlayMap, {
        collapsed: false
    }).addTo(myMap);

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [-10, 10, 30, 50, 70, 90],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);
};
