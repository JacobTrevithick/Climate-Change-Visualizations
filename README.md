# Climate-Change-Visualizations

# Earthquake Data Visualizations with Leaflet 

Interactive map and visualizations that visualize global power plants and green house gas emissions by country. 

## Description

We looked at data from various countries detailing greenhouse gas emissions as well as power plant information.

**Data includes:**

* Types of emissions per country per year.

* Individual power plant’s location and fuel type.

* Total emissions per year.

* Total amount of power (gwh) generated per year.

### ETL Pipeline

A PostgreSQL relational database is used to house the aggregated and cleaned power plant/emissions data. 

First, the power plant database is pulled in and cleaned. This includes:

* Dropping unneccesary columns
* Standardizing country names
* Catagorizing energy type (clean or dirty)
* Converting generated/estimated power generation columns to rows using .melt() pandas method

Secondly, the greenhouse gas data similarly to create matching country name formats and reducing complexity in greenhouse gas categorization.

Next, IDs are created for the country name, fuel type, and plant name for database upload. This is to ensure that the DB design is closer to 3rd normal form. The database is constructed as follows:

![Database Design](https://github.com/JacobTrevithick/Climate-Change-Visualizations/blob/main/Database/PostgresDBdiagram.png)

The following visualizations pull from this SQL database using the Python Library SQLalchemy using an ORM (object relational mapping). Calls to the SQL database are made via a Flask app running the connection between the website and the database.

### Visualizations

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

* Note: must have Postgres SQL installed locally to run.
* Clone this repository to your desktop.
* Create virtual environment using requirements.txt for dependencies
* Create 'config.py' file in main directory storing:
    username = "Your_postgres_username_here"
    password = "Your_postgres_username_here"
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

