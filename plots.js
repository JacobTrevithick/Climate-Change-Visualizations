// Bar plot for reported and estimated energy production by country
// Data needs:
  // country name
  // List of total GWh estimated and generated each year
  // Calculate % of estimated and generated (compared to global average) each year 

// Test data (to be replaced)

let year_generated = [2013, 2014, 2015, 2016, 2017, 2018, 2019];

let year_estimated =  [2013, 2014, 2015, 2016, 2017];

let gwh_generated = [3474741,3456613,3573784,3512827,3529342,3634343,4094667];

let gwh_estimated = [525398,548595,524676,593993,4653165];

// Global average gwh generated (all countries)

let global_sum = [3803331,4746498,6253712,6338161,6287425,4985420,4094667];

let upper = [2768,2888,3296,3098,3031,2493,2122];

let lower = [-1582,-1575,-1771,-1711,-1707,-1458,-1275];

// Grouped Bar Chart

var trace1 = {
    x: year_generated,
    y: gwh_generated,
    name: 'Reported',
    marker: {color: 'rgb(55, 83, 109)'},
    // Add % of global average data here
    text: ['Percent of global average','Percent of global average','Percent of global average','Percent of global average','Percent of global average','Percent of global average','Percent of global average'],
    type: 'bar'
  };
  
  var trace2 = {
    x: year_estimated,
    y: gwh_estimated,
    name: 'Estimated',
    marker: {color: 'rgb(26, 118, 255)'},
    text: ['Percent of global average','Percent of global average','Percent of global average','Percent of global average','Percent of global average'],
    type: 'bar'
  };
  
  var data = [trace1, trace2];
  
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
  
  Plotly.newPlot('bubble', data, layout);



// Line chart GHG emissions 
// Data needs:
  // List of total GHG, CO2, CH4, N2O values 

// Test data (to be replaced)

let ghg_year = [1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014]

let ghg_total = [6397144.49,6330937.886,6448677.154,6566415.856,6650296.595,6748528.926,6949838.004,6999999.1,7066788.163,7090442.611,7258973.117,7140899.141,7185328.138,7224974.033,7369970.035,7378775.498,7316144.456,7422207.963,7216415.071,6776229.774,6985457.053,6865397.903,6643010.578,6799979.303,6870446.092];

let co2 = [5115095.047,5064879.75,5170274.35,	5284758.62,	5377492.217,	5441599.23,	5630113.715,	5704996.869,	5744672.196,	5818972.385,	5992438.04,	5894462.942,	5935738.784,	5982289.167,	6096978.363,	6122746.612,	6042393.615,	6121653.863,	5923201.376,	5488320.28,	5688756.005,	5559507.664,	5349220.947,	5502550.714,	5556006.578];

let ch4 = [773854.8964,	777034.2209,	776869.7898,	764089.6713,	770450.4261,	767943.4057,	762203.8462,	747177.1101,	737821.4206,	723454.8736,	717473.9352,	712676.765,	706330.2419,	708554.517,	704886.7766,	717356.2047,	719580.6921,	725974.6404,	738889.5409,	735358.6952,	722410.5661,	717423.6902,	714401.1725,	721475.0556,	730828.6595];

let n2o = [406228.5266,	396113.6569,	404052.1071,	420503.1909,	402478.9305,	420585.7486,	428923.512,	412317.9833,	433872.6492,	401147.4076,	401400.224,	399324.4245,	400917.9017,	401775.3062,	428554.1716,	397551.7201,	410066.1909,	418985.1625,	396777.0898,	399500.4873,	410314.2395,	416521.7792,	409285.5838,	403349.7467,	403501.4571];

// Stacked line plot
var trace1 = {
  x: ghg_year,
  y: n2o,
  fill: 'tozeroy',
  name: "Nitrous oxide",
  type: 'scatter',
  mode: 'none'
};

var trace2 = {
  x: ghg_year,
  y: ch4,
  fill: 'tonexty',
  name: "Methane",
  type: 'scatter',
  mode: 'none'
};

var trace3 = {
  x: ghg_year,
  y: co2,
  fill: 'tonexty',
  name: "Carbon dioxide",
  type: 'scatter',
  mode: 'none'
};

var trace4 = {
  x: ghg_year,
  y: ghg_total,
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

// Doughnut chart for clean v. dirty energy 
// Data needs:
  // Total number of clean energy plants and dirty energy plants

let clean = 20;

let dirty = 80;

var data = [{
  type: "pie",
  values: [clean, dirty],
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








