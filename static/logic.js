var localHostURL = "http://127.0.0.1:5000/";
var flaskGlobalViewURL = localHostURL + "global_view";


var countryOutlineURL = '/static/countries.geojson'


d3.json(flaskGlobalViewURL).then(function (response) {
    
    console.log(response);

    // Input dropdown menu items
    var options = response.country_names;
    var sel = document.getElementById('selDataset');

    // loop through sample ids and append to the menu list
    for (var i = 0; i < options.length; i++){
        // create new 'option' element and give it HTML and value attributes. Then append to dropdown menu.
        var opt = document.createElement('option');
        opt.innerHTML = options[i];
        opt.value = options[i];
        sel.appendChild(opt);
    };


    // Map will be drawn here using response data
    var powerPlantLayer = createPowerPlantsLayer(response);

    d3.json(countryOutlineURL).then(function(geoResponse) {

        // takes in 'options' variable as country names to compare for ghg color fills
        var countryLayer = createCountryLayer(geoResponse, response);

        createMap(powerPlantLayer, countryLayer);

    })

 

    var trace_est_clean = {
        x: response.pp_years,
        y: response.estimated_clean,
        text: response.estimated_clean,
        marker: {color: '#006400'},
        type: 'bar',
        name: 'Estimated Clean Energy Generated'
    };

    var trace_gen_clean = {
        x: response.pp_years,
        y: response.generated_clean,
        text: response.generated_clean,
        marker: {color: '#8FBC8F'},
        type: 'bar',
        name: 'Reported Clean Energy Generated'
    };

    var trace_est_dirty = {
        x: response.pp_years,
        y: response.estimated_dirty,
        text: response.estimated_dirty,
        marker: {color: '#696969'},
        type: 'bar',
        name: 'Estimated Dirty Energy Generated'
    };

    var trace_gen_dirty = {
        x: response.pp_years,
        y: response.generated_dirty,
        text: response.generated_dirty,
        marker: {color: '#DCDCDC'},
        type: 'bar',
        name: 'Reported Dirty Energy Generated'
    };

    var barData = [trace_gen_clean, trace_gen_dirty, trace_est_clean, trace_est_dirty];

    console.log(barData);
    var region = 'Global';

    var layout = {
        barmode: 'group',
        // Add country name here
        title: `Energy produced by power plants in the ${region}`,
        yaxis: {
            title: "Gigawatt hours (GWh)"
            },
        xaxis: {
            range: [2012,2018],
            title: "Year"
        }
    };

    Plotly.newPlot('bar', barData, layout);

    // Stacked line plot
    var trace1 = {
        x: response.greenhouse_years,
        y: response.n2o_totals,
        fill: 'tozeroy',
        name: "Nitrous oxide",
        type: 'scatter',
        mode: 'none'
    };
    
    var trace2 = {
        x: response.greenhouse_years,
        y: response.ch4_totals,
        fill: 'tonexty',
        name: "Methane",
        type: 'scatter',
        mode: 'none'
    };
    
    var trace3 = {
        x: response.greenhouse_years,
        y: response.co2_totals,
        fill: 'tonexty',
        name: "Carbon dioxide",
        type: 'scatter',
        mode: 'none'
    };
    
    var trace4 = {
        x: response.greenhouse_years,
        y: response.ghgs_totals,
        fill: 'tonexty',
        name: "Total GHG emissions",
        type: 'scatter',
        mode: 'none'
    };
    
    
    var layout = {
        title: 'Historic GHG emission',
        // height: 600,
        // width: 1200,
        yaxis: {
        title: "kilotonne CO2 equivalent"
        },
        xaxis: {
        title: "Year"
        },
    };
    
    var data = [trace1, trace2, trace3, trace4];
    
    Plotly.newPlot('line', data, layout);

    var data = [{
        type: "pie",
        values: [response.clean_plant_count, response.dirty_plant_count],
        labels: ["Clean power plants", "Dirty power plants"],
        marker: {colors: ['#8FBC8F','#696969']},
        textinfo: "label+percent",
        textposition: "outside",
        automargin: true
    }]
    
    var layout = {
        // height: 400,
        // width: 400,
        margin: {"t": 0, "b": 0, "l": 0, "r": 0},
        showlegend: false
        }
    
    Plotly.newPlot('pie', data, layout)


    const radarData = {
        labels: response.plant_labels,
        datasets: [{
            label: 'Number of Total Power Plants',
            data: response.plant_counts_split,
            fill: true,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            pointBackgroundColor: 'rgb(255, 99, 132)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(255, 99, 132)'
        }]
    };
    
    const config = {
        type: 'radar',
        data: radarData,
        options: {
            elements: {
                line: {
                    borderWidth: 3
                }
            }
        }
    };
    
    var radar = new Chart(
        document.getElementById('myRadar'),
        config
    );
});

// Trigger updatePlotly on a change to the dropdown menu value
d3.selectAll("#selDataset").on("change", updatePlotly);

function updatePlotly() {


    // select the dropdown menu from the page
    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var country = dropdownMenu.property("value").trim().toLowerCase();
    console.log(country);
    // create flask API url specific to country
    var flaskCountryViewURL = localHostURL + country;
    
    // open data file
    d3.json(flaskCountryViewURL).then(function(response){

        console.log(response.pp_years);

        var trace_est_clean = {
            x: response.pp_years,
            y: response.estimated_clean,
            text: response.estimated_clean,
            marker: {color: '#006400'},
            type: 'bar',
            name: 'Estimated Clean Energy Generated'
        };
    
        var trace_gen_clean = {
            x: response.pp_years,
            y: response.generated_clean,
            text: response.generated_clean,
            marker: {color: '#8FBC8F'},
            type: 'bar',
            name: 'Reported Clean Energy Generated'
        };
    
        var trace_est_dirty = {
            x: response.pp_years,
            y: response.estimated_dirty,
            text: response.estimated_dirty,
            marker: {color: '#696969'},
            type: 'bar',
            name: 'Estimated Dirty Energy Generated'
        };
    
        var trace_gen_dirty = {
            x: response.pp_years,
            y: response.generated_dirty,
            text: response.generated_dirty,
            marker: {color: '#DCDCDC'},
            type: 'bar',
            name: 'Reported Dirty Energy Generated'
        };
    
        var barData = [trace_gen_clean, trace_gen_dirty, trace_est_clean, trace_est_dirty];
    
        console.log(barData);
        var region = 'Global';
    
        var layout = {
            barmode: 'group',
            // Add country name here
            title: `Energy produced by power plants in the ${region}`,
            yaxis: {
                title: "Gigawatt hours (GWh)"
                },
            xaxis: {
                title: "Year",
                range: [2012,2018]
            }
        };
    
        Plotly.newPlot('bar', barData, layout);
    
        // Stacked line plot
        var trace1 = {
            x: response.greenhouse_years,
            y: response.n2o_totals,
            fill: 'tozeroy',
            name: "Nitrous oxide",
            type: 'scatter',
            mode: 'none'
        };
        
        var trace2 = {
            x: response.greenhouse_years,
            y: response.ch4_totals,
            fill: 'tonexty',
            name: "Methane",
            type: 'scatter',
            mode: 'none'
        };
        
        var trace3 = {
            x: response.greenhouse_years,
            y: response.co2_totals,
            fill: 'tonexty',
            name: "Carbon dioxide",
            type: 'scatter',
            mode: 'none'
        };
        
        var trace4 = {
            x: response.greenhouse_years,
            y: response.ghgs_totals,
            fill: 'tonexty',
            name: "Total GHG emissions",
            type: 'scatter',
            mode: 'none'
        };
        
        
        var layout = {
            title: 'Historic GHG emission',
            // height: 600,
            // width: 1200,
            yaxis: {
            title: "kilotonne CO2 equivalent"
            },
            xaxis: {
            title: "Year"
            },
        };
        
        var data = [trace1, trace2, trace3, trace4];
        
        Plotly.newPlot('line', data, layout);
    
        var data = [{
            type: "pie",
            values: [response.clean_plant_count, response.dirty_plant_count],
            labels: ["Clean power plants", "Dirty power plants"],
            marker: {colors: ['#8FBC8F','#696969']},
            textinfo: "label+percent",
            textposition: "outside",
            automargin: true
        }]
        
        var layout = {
            // height: 400,
            // width: 400,
            margin: {"t": 0, "b": 0, "l": 0, "r": 0},
            showlegend: false
            }
        
        Plotly.newPlot('pie', data, layout)
    
        document.querySelector("#radarPlot").innerHTML = '<canvas id="myRadar"></canvas>';
    
        const radarData = {
            labels: response.plant_labels,
            datasets: [{
                label: 'Number of Total Power Plants',
                data: response.plant_counts_split,
                fill: true,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgb(255, 99, 132)',
                pointBackgroundColor: 'rgb(255, 99, 132)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(255, 99, 132)'
            }]
        };
        
        const config = {
            type: 'radar',
            data: radarData,
            options: {
                elements: {
                    line: {
                        borderWidth: 3
                    }
                }
            }
        };
        
        var radar = new Chart(
            document.getElementById('myRadar'),
            config
        );

        // update all plots with the current selection.
        // updateBar();
        // updateBubble();
        // updateGauge();
        // updateRadar();
    });
};

function createMap(markerLayer, countryOutlineLayer) {

    var mapCenter = [39.9283, -98.5795];
    var mapZoom = 2;

    // Create the tile layer that will be the background of our map.
    var streetMapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }); 
    
    var myMap = L.map('map', {
        center: mapCenter,
        zoom: mapZoom,
        layers: [streetMapLayer, markerLayer, countryOutlineLayer]
    });

    var baseMap = {
        "Street Map": streetMapLayer
    };

    var powerPlantsOverlayMap = {
        "Power Plants": markerLayer,
        "Greenhouse Gases per Country": countryOutlineLayer
    };

    L.control.layers(baseMap, powerPlantsOverlayMap, {
        collapsed: false
    }).addTo(myMap);

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 10000, 100000, 1000000],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            console.log(getColor(grades[i] + 1))
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);
};

function createPowerPlantsLayer(response) {

    var ppMarkers = [];

    for (var i = 0; i < response.map_pp_types.length; i++) {

        var primaryFuel = response.map_pp_types[i];
        var latLon = [response.map_pp_lat[i], response.map_pp_lon[i]];
        var countryName = response.map_pp_country[i];

        //Default dirty color
        var color = '#696969';

        let cleanEnergyTypes = ['Hydro', 'Solar', 'Gas', 'Wind', 'Waste','Biomass', 'Wave and Tidal', 'Geothermal', 'Storage', 'Cogeneration', 'Nuclear'];

        for (var j = 0; j < cleanEnergyTypes.length; j++) {

            if (primaryFuel == cleanEnergyTypes[j]){
                
                color = '#8FBC8F';
            }
        }

        var ppMarker = L.circle(latLon, {
            color: color,
            fillColor: color,
            fillOpacity: 0.75,
            radius: 3000
        }).bindPopup(`<h3>Primary Fuel Type: ${primaryFuel}</h3><hr><h3>Country: ${countryName}</h3><br><h3>Lat, Lon: ${latLon[0]}, ${latLon[1]}</h3>`);

        ppMarkers.push(ppMarker);
    };

    var ppMarkerLayerGroup = L.layerGroup(ppMarkers);

    return ppMarkerLayerGroup;

};


// takes in geoJSON file containing the outlines of all countries
function createCountryLayer(geoResponse, queryResponse){
    
    var countries = geoResponse.features;
    var countryNameArrayDB = queryResponse.map_geo_country;

    var countryColorObject = {}

    // // default color
    // var countryColor = '#FFFFFF'

    for (var i = 0; i < countries.length; i++){
        
        var geoCountryName = countries[i].properties['ADMIN'].toLowerCase();

        countryColorObject[countries[i].properties['ADMIN']] = '#FFFFFF';

        for (var j = 0; j < countryNameArrayDB.length; j++){

            if (geoCountryName == countryNameArrayDB[j]){

                countryColor = getGeoColor(queryResponse.map_geo_ghgs_values[j]);

                countryColorObject[countries[i].properties['ADMIN']] = countryColor;
            }
        }
    }

    var countryOutlines = L.geoJSON(countries, {
        style: function(feature){
            return {color: countryColorObject[feature.properties['ADMIN']]}
        },
        onEachFeature: onEachFeature
    });

    return countryOutlines;
};

function getGeoColor(value) {

    if (value < 9999){
        return "#31F615"
    } else if (value < 99999){
        return "#F6F615"
    } else if (value < 999999){
        return "#F6A815"
    } else {
        return '#FF1B00'
    };

};


function onEachFeature(feature, layer) {

    layer.bindPopup(`<h3>Country: ${feature.properties['ADMIN']}</h3>`);
};


function getColor(d) {
    return d > 999999 ? '#FF1B00' :
           d > 99999  ? '#F6A815' :
           d > 9999  ? '#F6F615' :
                      '#31F615';
};