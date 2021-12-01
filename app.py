from flask import Flask, render_template, redirect, jsonify
import pandas as pd
import config
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, distinct

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

    pp_years = ['2013', '2014', '2015', '2016','2017', '2018', '2019']

    global_dict = {
        'pp_years': pp_years, # done
        'generated_clean': [], # done
        'estimated_clean': [], # done
        'generated_dirty': [], # done
        'estimated_dirty': [], # done
        'clean_plant_count': [],
        'dirty_plant_count': [],
        'plant_labels': [],
        'plant_counts_split': [],
        'greenhouse_years': [],
        'ghgs_totals': [],
        'co2_totals': [],
        'ch4_totals': [],
        'n2o_totals': []
    }

    gen_base = 'generation_gwh_'
    est_base = 'estimated_generation_gwh_'

    # total power production data for plants
    for year in pp_years:
        
        # finding the sum of estimated totals 
        try:
            est_string = est_base + year
            est_column = getattr(ppgs, est_string)

            # clean estimated results
            results_clean = session.query(func.sum(est_column)).join(ppi, ppgs.plant_id == ppi.plant_id).filter(ppi.clean_energy == True).all()
            
            value_clean = results_clean[0][0]
            
            if value_clean is None:
                global_dict['estimated_clean'].append(None)
            else:
                global_dict['estimated_clean'].append(float(value_clean))
            
            # non-clean estimated results
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
            
    # Power plant counts section here:
    count_results_clean = session.query(func.count(ppi.plant_id)).filter(ppi.clean_energy == True).all()[0][0]
    count_results_dirty = session.query(func.count(ppi.plant_id)).filter(ppi.clean_energy == False).all()[0][0]

    global_dict['clean_plant_count'] = count_results_clean
    global_dict['dirty_plant_count'] = count_results_dirty

    # power plant counts distributed by count
    pp_distribution_results = session.query(ppi.primary_fuel, func.count(ppi.primary_fuel)).group_by(ppi.primary_fuel).all()

    pp_dist_df = pd.DataFrame(pp_distribution_results, columns = ['primary_fuel', 'count'])

    global_dict['plant_labels'] = pp_dist_df['primary_fuel'].tolist()
    global_dict['plant_counts_split'] = pp_dist_df['count'].tolist()


    # Greenhouse gases data pulling here:
    ghgs_years_results = session.query(distinct(ghg.year)).order_by(ghg.year).all()
    ghgs_years_list = pd.DataFrame(ghgs_years_results, columns = ['years'])['years'].tolist()

    global_dict['greenhouse_years'] = ghgs_years_list

    # need to create function for this
    ghgs_totals_results = session.query(func.sum(ghg.value)).filter(ghg.category_short == 'ghgs').group_by(ghg.year).order_by(ghg.year).all()
    ghgs_totals_list = pd.DataFrame(ghgs_totals_results, columns = ['totals'])['totals'].tolist()
    ghgs_totals_floats = [float(x) for x in ghgs_totals_list]
    global_dict['ghgs_totals'] = ghgs_totals_floats

    co2_totals_results = session.query(func.sum(ghg.value)).filter(ghg.category_short == 'co2').group_by(ghg.year).order_by(ghg.year).all()
    co2_totals_list = pd.DataFrame(co2_totals_results, columns = ['totals'])['totals'].tolist()
    co2_totals_floats = [float(x) for x in co2_totals_list]
    global_dict['co2_totals'] = co2_totals_floats

    ch4_totals_results = session.query(func.sum(ghg.value)).filter(ghg.category_short == 'ch4').group_by(ghg.year).order_by(ghg.year).all()
    ch4_totals_list = pd.DataFrame(ch4_totals_results, columns = ['totals'])['totals'].tolist()
    ch4_totals_floats = [float(x) for x in ch4_totals_list]
    global_dict['ch4_totals'] = ch4_totals_floats

    n2o_totals_results = session.query(func.sum(ghg.value)).filter(ghg.category_short == 'n2o').group_by(ghg.year).order_by(ghg.year).all()
    n2o_totals_list = pd.DataFrame(n2o_totals_results, columns = ['totals'])['totals'].tolist()
    n2o_totals_floats = [float(x) for x in n2o_totals_list]
    global_dict['n2o_totals'] = n2o_totals_floats
    
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