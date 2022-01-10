# Climate-Change-Visualizations

# Earthquake Data Visualizations with Leaflet 

Interactive map and visualizations that visualize global power plants and green house gas emissions by country. 

## Description

We looked at data from various countries detailing greenhouse gas emissions as well as power plant information.

Data includes:

Types of emissions per country per year.

Individual power plant’s location and fuel type.

Total emissions per year.

Total amount of power (gwh) generated per year.


**Interactive Leaflet Map:**

Interactivate Leaflet map showing the location and information about all the globale power plants. They are color coded based on whether they use clean or dirty sources to generate energy: green for clean and grey for dirty.

![Interactive Leaflet Map](https://github.com/JacobTrevithick/Climate-Change-Visualizations/blob/main/Images/Title_Map.png)

**Clean vs. Dirty Power Plant Breakdown:**

Pie chart displaying the breakdown of clean vs. dirty energy power plants. When the website is first launched, it displays the global totals. The chart updates to just a country level breakdown when the user chooses a country.

![Pie Chart](https://github.com/JacobTrevithick/Climate-Change-Visualizations/blob/main/Images/Pie_chart.png)

**Historic GHG Emissions:**

Chart displaying greenhouse gas emissions over time. Global totals on launch and adjusts to country level when user chooses a country.

![Historic GHG Emissions](https://github.com/JacobTrevithick/Climate-Change-Visualizations/blob/main/Images/Greenhouse_gas_emissions.png)

**Energy Producted by Power Plants:**

Shows total energy produced by clean and dirty energy sources. It includes estimated and recorded values. Global totals on launch and adjusts to country level when user chooses a country.

![Power Plant energy production](https://github.com/JacobTrevithick/Climate-Change-Visualizations/blob/main/Images/Energy_Production_clean_v_dirty.png)

**Power Plant Breakdown by Energy Type:**

Radar chart demonstrating the breakdown of every power plant energy type. Global totals on launch and adjusts to country level when user chooses a country.

![Power Plant energy type breakdown](https://github.com/JacobTrevithick/Climate-Change-Visualizations/blob/main/Images/Power_plant_type_radar.png)

**Doomsday Counter:**
![Doomsday Counter](https://github.com/JacobTrevithick/Climate-Change-Visualizations/blob/c63ea5cc8a825d7a65be15d0731da24d290968f7/Images/Doomsday_counter.png)

## Getting Started

### Technologies Used 

* Python
* Flask
* PostgreSQL (Postgres)
* SQLalchemy
* JavaScript
* HTML
* Plotly
* Leaflet

### Installing

* Clone this repository to your desktop.
* Create virtual environment using requirements.txt for dependencies
* Run data_cleaning_pipeline.ipynb to create Postgres Database with cleaned data
* Run 'python3 app.py' from cloned repo (with venv activated)
* Copy and paste web address for localhost into web browser

### Data Sources

* Power Plant Dataset: https://datasets.wri.org/dataset/globalpowerplantdatabase
* Greenhouse gas emissions dataset: https://www.kaggle.com/unitednations/international-greenhouse-gas-emissions

## Authors

# Group:
Jacob Trevithick,
Katlin Bowman,
William Lubenow,
Michael Bradberry

E: jacob.trevithick@gmail.com

Jacob's LinkedIn: [LinkedIn](https://www.linkedin.com/in/jacob-trevithick/)

