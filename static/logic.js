var localHostURL = "http://127.0.0.1:5000/";
var flaskGlobalViewURL = localHostURL + "global_view";


d3.json(flaskGlobalViewURL).then(function (response) {

    var trace_est_clean = {
        x: response.years,
        y: response.estimated_clean,
        text: response.estimated_clean,
        type: 'bar',
        name: 'Estimated Clean Energy Generated'
    };

    var trace_gen_clean = {
        x: response.years,
        y: response.generated_clean,
        text: response.generated_clean,
        type: 'bar',
        name: 'Reported Clean Energy Generated'
    };

    var trace_est_dirty = {
        x: response.years,
        y: response.estimated_dirty,
        text: response.estimated_dirty,
        type: 'bar',
        name: 'Estimated Dirty Energy Generated'
    };

    var trace_gen_dirty = {
        x: response.years,
        y: response.generated_dirty,
        text: response.generated_dirty,
        type: 'bar',
        name: 'Reported Dirty Energy Generated'
    };

    var barData = [trace_gen_clean, trace_gen_dirty, trace_est_clean, trace_est_dirty];

    var layout = {
        barmode: 'group',
        // Add country name here
        title: "Energy produced by power plants in the United States",
        yaxis: {
          title: "Gigawatt hours (GWh)"
        },
        xaxis: {
          title: "Year"
        },
      };

    Plotly.newPlot('bar', barData, layout);

});


// Trigger updatePlotly on a change to the dropdown menu value
d3.selectAll("#selDataset").on("change", updatePlotly);

// function createMap(markerLayer, countryLayer) {

//     // Create the tile layer that will be the background of our map.
//     var streetMapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//     });

//     var topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
//         attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
//     });    

//     var satelliteLayer = L.tileLayer.provider('MapBox', {
//         id: 'mapbox/satellite-v9',
//         accessToken: 'pk.eyJ1IjoiamFjb2J0cmV2aXRoaWNrMSIsImEiOiJja3c2eG45bjgzNGtoMnZwYXRnYjJzNGttIn0.3qRI1UQUwRpCWWo_uFk1Tw'
//     });
    

//     var myMap = L.map('map', {
//         center: mapCenter,
//         zoom: mapZoom,
//         layers: [streetMapLayer, markerLayer, topoLayer, countryLayer, satelliteLayer]
//     });

//     var baseMap = {
//         "Street Map": streetMapLayer,
//         "Topographical Map": topoLayer,
//         "Satellite Map": satelliteLayer
//     };

//     var earthquakeOverlayMap = {
//         "Earthquakes": markerLayer,
//         "Greenhouse Gases": countryLayer
//     };

//     L.control.layers(baseMap, earthquakeOverlayMap, {
//         collapsed: false
//     }).addTo(myMap);

//     var legend = L.control({position: 'bottomright'});

//     legend.onAdd = function (map) {

//         var div = L.DomUtil.create('div', 'info legend'),
//             grades = [-10, 10, 30, 50, 70, 90],
//             labels = [];

//         // loop through our density intervals and generate a label with a colored square for each interval
//         for (var i = 0; i < grades.length; i++) {
//             div.innerHTML +=
//                 '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
//                 grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
//         }

//         return div;
//     };

//     legend.addTo(myMap);
// };
