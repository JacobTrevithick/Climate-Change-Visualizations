from flask import Flask, render_template, redirect
import config
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

# Create an instance of Flask
app = Flask(__name__)

# create sqlalchemy engine to connect to postgresql db
database_name = 'Climate_DB'

engine = create_engine(f'postgresql://{config.username}:{config.password}@localhost:5432/{database_name}')

# reflect an existing database into a new model
Base = automap_base()
Base.prepare(engine, reflect = True)

# create table objects
countries = Base.classes.countries
greenhouse_gases = Base.classes.greenhouse_gases
power_plant_names = Base.classes.power_plant_names
power_plant_gen_stats = Base.classes.power_plant_gen_stats
power_plants_info = Base.classes.power_plants_info

# Route to render index.html template
@app.route("/")
def home():

    return render_template("index.html")
   

# Route that will trigger the scrape function
@app.route("/<country_name>")
def update(country_name):

    # return some json object

if __name__ == "__main__":
    app.run(debug=True)