var localHostURL = "http://127.0.0.1:5000/";
var flaskGlobalViewURL = localHostURL + "global_view";
var countryOutlineURL = 'https://datahub.io/core/geo-countries/r/0.html'


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

    // d3.json(countryOutlineURL).then(function(response) {

    //     var countryLayer = createCountryLayer(response);

    //     createMap(powerPlantLayer, countryLayer);

    // })

    createMap(powerPlantLayer);

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
        title: 'Historic GHG emission from electricity production',
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
            title: 'Historic GHG emission from electricity production',
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

function createMap(markerLayer) {

    var mapCenter = [39.9283, -98.5795];
    var mapZoom = 10;

    // Create the tile layer that will be the background of our map.
    var streetMapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }); 
    
    var myMap = L.map('map', {
        center: mapCenter,
        zoom: mapZoom,
        layers: [streetMapLayer, markerLayer]
    });

    var baseMap = {
        "Street Map": streetMapLayer
    };

    var powerPlantsOverlayMap = {
        "Power Plants": markerLayer
    };

    L.control.layers(baseMap, powerPlantsOverlayMap, {
        collapsed: false
    }).addTo(myMap);

    // var legend = L.control({position: 'bottomright'});

    // legend.onAdd = function (map) {

    //     var div = L.DomUtil.create('div', 'info legend'),
    //         grades = ['Clean Energy', 'Dirty Energy'],
    //         labels = [];

    //     // loop through our density intervals and generate a label with a colored square for each interval
    //     for (var i = 0; i < grades.length; i++) {
    //         div.innerHTML +=
    //             '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
    //             grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    //     }

    //     return div;
    // };

    // legend.addTo(myMap);
};

// UNFINISHED NEED TO adjust colors
function createPowerPlantsLayer(response) {

    var ppMarkers = [];

    console.log(response.map_pp_types);

    for (var i = 0; i < response.map_pp_types.length; i++) {


        var primaryFuel = response.map_pp_types[i];
        var latLon = [response.map_pp_lat[i], response.map_pp_lon[i]];
        var countryName = response.map_pp_country[i];

        //Default dirty color
        var color = '#696969';

        let cleanEnergyTypes = ['Hydro', 'Solar', 'Gas', 'Wind', 'Waste','Biomass', 'Wave and Tidal', 'Geothermal', 'Storage', 'Cogeneration', 'Nuclear'];

        for (var j = 0; j < cleanEnergyTypes.length; j++) {
            console.log(primaryFuel);
            console.log(cleanEnergyTypes[j]);
            if (primaryFuel == cleanEnergyTypes[j]){
                
                color = '#8FBC8F';
            }
        }
        console.log(primaryFuel);
        console.log(color);

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
function createCountryLayer(response){
    
    var countries = response.features;

    var countryOutlines = L.geoJSON(countries);

    return countryOutlines;
};

// function getColor(d) {
//     return d > 90 ? '#78281F' :
//            d > 70  ? '#E74C3C' :
//            d > 50  ? '#F39C12' :
//            d > 30  ? '#F9E79F' :
//            d > 10   ? '#82E0AA' :
//                       '#1D8348';
// };