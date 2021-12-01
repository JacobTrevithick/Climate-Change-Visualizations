from flask import Flask, render_template, redirect, jsonify
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
co = Base.classes.countries
ghg = Base.classes.greenhouse_gases
ppn = Base.classes.power_plant_names
ppgs = Base.classes.power_plant_gen_stats
ppi = Base.classes.power_plants_info

# Route to render index.html template
@app.route("/")
def home():

    return render_template("index.html")
   
# Route to trigger initial vis view before any user input is selected
@app.route("/global_view")
def global_view():

    session = Session(engine)

    years = ['2013', '2014', '2015', '2016','2017', '2018', '2019']

    global_dict ={
        'years': years,
        'generated_clean': [],
        'estimated_clean': [],
        'generated_dirty': [],
        'estimated_dirty': []
    }

    gen_base = 'generation_gwh_'
    est_base = 'estimated_generation_gwh_'

    for year in years:
        
        # finding the sum of estimated totals 
        try:
            est_string = est_base + year
            est_column = getattr(ppgs, est_string)

            # clean results
            results_clean = session.query(func.sum(est_column)).join(ppi, ppgs.plant_id == ppi.plant_id).filter(ppi.clean_energy == True).all()
            
            value_clean = results_clean[0][0]
            
            if value_clean is None:
                
                global_dict['estimated_clean'].append(None)
                
            else:
                global_dict['estimated_clean'].append(float(value_clean))
            
            # non-clean results
            results_dirty = session.query(func.sum(est_column)).join(ppi, ppgs.plant_id == ppi.plant_id).filter(ppi.clean_energy == False).all()
            
            value_dirty = results_dirty[0][0]
            
            if value_dirty is None:
                
                global_dict['estimated_dirty'].append(None)
                
            else:
                global_dict['estimated_dirty'].append(float(value_dirty))
            
        except:
            
            global_dict['estimated_dirty'].append(None)
            global_dict['estimated_clean'].append(None)
        
        # finding the sum of generated totals 
        gen_string = gen_base + year
        gen_column = getattr(ppgs, gen_string)
        
        # clean results
        gen_results_clean = session.query(func.sum(gen_column)).join(ppi, ppgs.plant_id == ppi.plant_id).filter(ppi.clean_energy == True).all()
        
        gen_value_clean = float(gen_results_clean[0][0])
        global_dict['generated_clean'].append(gen_value_clean)
        
        # non-clean results
        gen_results_dirty = session.query(func.sum(gen_column)).join(ppi, ppgs.plant_id == ppi.plant_id).filter(ppi.clean_energy == False).all()
        
        gen_value_dirty = float(gen_results_dirty[0][0])
        global_dict['generated_dirty'].append(gen_value_dirty)

    session.close()

    # return global totals
    return jsonify(global_dict)

# Route that will trigger the scrape function
@app.route("/<country_name>")
def update(country_name):

    # return json object for specific country totals
    return

if __name__ == "__main__":
    app.run(debug=True)