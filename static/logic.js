var localHostURL = "http://127.0.0.1:5000/";
var flaskGlobalViewURL = localHostURL + "global_view";


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

    var trace_est_clean = {
        x: response.pp_years,
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

    var region = 'Global'

    var layout = {
        barmode: 'group',
        // Add country name here
        title: `Energy produced by power plants in the ${region}`,
        yaxis: {
        title: "Gigawatt hours (GWh)"
        },
        xaxis: {
        title: "Year"
        },
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
        height: 600,
        width: 1200,
        yaxis: {
        title: "kilotonne CO2 equivalent"
        },
        xaxis: {
        title: "Year"
        },
    };
    
    var data = [trace1, trace2, trace3, trace4];
    
    Plotly.newPlot('gauge', data, layout);

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
        height: 400,
        width: 400,
        margin: {"t": 0, "b": 0, "l": 0, "r": 0},
        showlegend: false
        }
    
    Plotly.newPlot('bar', data, layout)


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
        },
    };
    
    const radar = new Chart(
        document.getElementById('radar'),
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
    
        var region = 'Global'
    
        var layout = {
            barmode: 'group',
            // Add country name here
            title: `Energy produced by power plants in the ${region}`,
            yaxis: {
            title: "Gigawatt hours (GWh)"
            },
            xaxis: {
            title: "Year"
            },
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
            height: 600,
            width: 1200,
            yaxis: {
            title: "kilotonne CO2 equivalent"
            },
            xaxis: {
            title: "Year"
            },
        };
        
        var data = [trace1, trace2, trace3, trace4];
        
        Plotly.newPlot('gauge', data, layout);
    
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
            height: 400,
            width: 400,
            margin: {"t": 0, "b": 0, "l": 0, "r": 0},
            showlegend: false
            }
          
          Plotly.newPlot('bar', data, layout)
    
    
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
            },
          };
          
          const radar = new Chart(
            document.getElementById('radar'),
            config
          );

        // update all plots with the current selection.
        // updateBar();
        // updateBubble();
        // updateGauge();
        // updateRadar();
    });
};
