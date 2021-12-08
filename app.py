from flask import Flask, render_template, redirect, jsonify
from flask_cors import CORS
import pandas as pd
import config
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, distinct

# Create an instance of Flask
app = Flask(__name__)

CORS(app, supports_credentials=True)

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
ft = Base.classes.fuel_types

# Route to render index.html template
@app.route("/")
def home():

    return render_template("index.html")
   
# Route to trigger initial vis view before any user input is selected
@app.route("/global_view")
def global_view():

    session = Session(engine)

    # pp_years = ['2013', '2014', '2015', '2016','2017', '2018', '2019']
    
    
    pp_years = session.query(distinct(ppgs.year)).group_by(ppgs.year).all()
    pp_years_list = pd.DataFrame(pp_years, columns=['pp_years'])['pp_years'].to_list()    
    
    
    global_dict = {
        'map_pp_types': [],# done
        'map_pp_lat': [],# done
        'map_pp_lon': [],# done
        'map_pp_country': [],# done
        'map_geo_country': [],# done
        'map_geo_ghgs_values': [],# done
        'country_names': [],# done
        'pp_years': pp_years_list, # done
        'generated_clean': [], # done
        'estimated_clean': [],# done
        'generated_dirty': [], # done
        'estimated_dirty': [], # done
        'clean_plant_count': [],# done
        'dirty_plant_count': [],# done
        'plant_labels': [],
        'plant_counts_split': [],
        'greenhouse_years': [],
        'ghgs_totals': [],
        'co2_totals': [],
        'ch4_totals': [],
        'n2o_totals': []
    }

    # querying power plant information for plotting purposes
    map_pp_results = session.query(ft.primary_fuel, ppi.latitude, ppi.longitude, co.country_long).join(co, ppi.country_id == co.country_id).join(ft, ppi.fuel_id == ft.fuel_id)

    map_pp_df = pd.DataFrame(map_pp_results, columns=['primary_fuel', 'lat', 'lon', 'country_name'])

    global_dict['map_pp_types'] = map_pp_df['primary_fuel'].tolist()
    global_dict['map_pp_lat'] = map_pp_df['lat'].apply(lambda x: float(x)).tolist()
    global_dict['map_pp_lon'] = map_pp_df['lon'].apply(lambda x: float(x)).tolist()
    global_dict['map_pp_country'] = map_pp_df['country_name'].tolist()


    # query country name list and ghgs value for each country to populate geojson coloring
    map_geo_results = session.query(ghg.value, co.country_long).join(co, ghg.country_id == co.country_id).filter(ghg.category_short == 'ghgs').filter(ghg.year == '2014').order_by(ghg.value).all()
    
    map_geo_df = pd.DataFrame(map_geo_results, columns=['ghg_value', 'country_name'])
    
    global_dict['map_geo_country'] = map_geo_df['country_name'].tolist()
    global_dict['map_geo_ghgs_values'] = map_geo_df['ghg_value'].apply(lambda x: float(x)).tolist()



    # query all country names
    country_name_results = session.query(co.country_long).order_by(co.country_long).all()
    country_name_list = pd.DataFrame(country_name_results, columns = ['names'])['names'].tolist()
    global_dict['country_names'] = country_name_list

    # total power production data for plants
    for year in pp_years:
        
        # finding the sum of estimated totals 
        try:

            # clean estimated results
            results_clean = session.query(func.sum(ppgs.estimated_gwh)).join(ppi, ppgs.plant_id == ppi.plant_id).join(ft, ppi.fuel_id == ft.fuel_id).filter(ft.clean_energy == True).filter(ppgs.year == year).all()
            
            value_clean = results_clean[0][0]
            
            if value_clean is None:
                global_dict['estimated_clean'].append(None)
            else:
                global_dict['estimated_clean'].append(float(value_clean))
            
            # non-clean estimated results
            results_dirty = session.query(func.sum(ppgs.estimated_gwh)).join(ppi, ppgs.plant_id == ppi.plant_id).join(ft, ppi.fuel_id == ft.fuel_id).filter(ft.clean_energy == False).filter(ppgs.year == year).all()
            
            value_dirty = results_dirty[0][0]
            
            if value_dirty is None:
                global_dict['estimated_dirty'].append(None)
            else:
                global_dict['estimated_dirty'].append(float(value_dirty))
            
        except:
            
            global_dict['estimated_dirty'].append(None)
            global_dict['estimated_clean'].append(None)
        
        # finding the sum of generated totals         
        # clean results
        gen_results_clean = session.query(func.sum(ppgs.generated_gwh)).join(ppi, ppgs.plant_id == ppi.plant_id).join(ft, ppi.fuel_id == ft.fuel_id).filter(ft.clean_energy == True).filter(ppgs.year == year).all()
        
        gen_value_clean = float(gen_results_clean[0][0])
        global_dict['generated_clean'].append(gen_value_clean)
        
        # non-clean results
        gen_results_dirty = session.query(func.sum(ppgs.generated_gwh)).join(ppi, ppgs.plant_id == ppi.plant_id).join(ft, ppi.fuel_id == ft.fuel_id).filter(ft.clean_energy == False).filter(ppgs.year == year).all()
        
        gen_value_dirty = float(gen_results_dirty[0][0])
        global_dict['generated_dirty'].append(gen_value_dirty)
            
    # Power plant counts section here:
    count_results_clean = session.query(func.count(ppi.plant_id)).join(ft, ppi.fuel_id == ft.fuel_id).filter(ft.clean_energy == True).all()[0][0]
    count_results_dirty = session.query(func.count(ppi.plant_id)).join(ft, ppi.fuel_id == ft.fuel_id).filter(ft.clean_energy == False).all()[0][0]

    global_dict['clean_plant_count'] = count_results_clean
    global_dict['dirty_plant_count'] = count_results_dirty

    # power plant counts distributed by count
    pp_distribution_results = session.query(ft.primary_fuel, func.count(ft.primary_fuel)).join(ppi, ft.fuel_id == ppi.fuel_id).group_by(ft.primary_fuel).all()

    pp_dist_df = pd.DataFrame(pp_distribution_results, columns = ['primary_fuel', 'count'])

    global_dict['plant_labels'] = pp_dist_df['primary_fuel'].tolist()
    global_dict['plant_counts_split'] = pp_dist_df['count'].tolist()


    # Greenhouse gases data pulling here:
    ghgs_years_results = session.query(distinct(ghg.year)).order_by(ghg.year).all()
    ghgs_years_list = pd.DataFrame(ghgs_years_results, columns = ['years'])['years'].tolist()

    global_dict['greenhouse_years'] = ghgs_years_list

    # need to create function for this
    global_dict['ghgs_totals'] = get_gh_yearly_totals(ghg, session, 'ghgs')
    global_dict['co2_totals'] = get_gh_yearly_totals(ghg, session, 'co2')
    global_dict['ch4_totals'] = get_gh_yearly_totals(ghg, session, 'ch4')
    global_dict['n2o_totals'] = get_gh_yearly_totals(ghg, session, 'n2o')
    
    session.close()

    # return global totals
    return jsonify(global_dict)


# # Route that will trigger the scrape function
@app.route("/<country_name>")
def update(country_name):

    session = Session(engine)

    pp_years = session.query(distinct(ppgs.year)).group_by(ppgs.year).all()
    pp_years_list = pd.DataFrame(pp_years, columns=['pp_years'])['pp_years'].to_list()  

    country_dict = {
        'pp_years': pp_years_list, # done
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

    # total power production data for plants
    for year in pp_years:
        
        # finding the sum of estimated totals 
        try:

            # clean estimated results
            results_clean = session.query(func.sum(ppgs.estimated_gwh)).join(ppi, ppgs.plant_id == ppi.plant_id).join(ft, ppi.fuel_id == ft.fuel_id).join(co, ppi.country_id == co.country_id).filter(co.country_long == country_name).filter(ft.clean_energy == True).filter(ppgs.year == year).all()
            
            value_clean = results_clean[0][0]
            
            if value_clean is None:
                country_dict['estimated_clean'].append(None)
            else:
                country_dict['estimated_clean'].append(float(value_clean))
            
            # non-clean estimated results
            results_dirty = session.query(func.sum(ppgs.estimated_gwh)).join(ppi, ppgs.plant_id == ppi.plant_id).join(ft, ppi.fuel_id == ft.fuel_id).join(co, ppi.country_id == co.country_id).filter(co.country_long == country_name).filter(ft.clean_energy == False).filter(ppgs.year == year).all()
            
            value_dirty = results_dirty[0][0]
            
            if value_dirty is None:
                country_dict['estimated_dirty'].append(None)
            else:
                country_dict['estimated_dirty'].append(float(value_dirty))
            
        except:
            
            country_dict['estimated_dirty'].append(None)
            country_dict['estimated_clean'].append(None)
        
        # finding the sum of generated totals       
        # clean results
        gen_results_clean = session.query(func.sum(ppgs.generated_gwh)).join(ppi, ppgs.plant_id == ppi.plant_id).join(ft, ppi.fuel_id == ft.fuel_id).join(co, ppi.country_id == co.country_id).filter(co.country_long == country_name).filter(ft.clean_energy == True).filter(ppgs.year == year).all()
        
        gen_value_clean = gen_results_clean[0][0]
        
        if gen_value_clean is None:
            country_dict['generated_clean'].append(None)
        else: 
            country_dict['generated_clean'].append(float(gen_value_clean))
        
        # non-clean results
        gen_results_dirty = session.query(func.sum(ppgs.generated_gwh)).join(ppi, ppgs.plant_id == ppi.plant_id).join(ft, ppi.fuel_id == ft.fuel_id).join(co, ppi.country_id == co.country_id).filter(co.country_long == country_name).filter(ft.clean_energy == False).filter(ppgs.year == year).all()
        
        
        gen_value_dirty = gen_results_dirty[0][0]
        
        if gen_value_dirty is None:
            country_dict['generated_dirty'].append(None)
        else: 
            country_dict['generated_dirty'].append(float(gen_value_dirty))
        
            
    # Power plant counts section here:
    count_results_clean = session.query(func.count(ppi.plant_id)).join(ft, ppi.fuel_id == ft.fuel_id).join(co, ppi.country_id == co.country_id).filter(co.country_long == country_name).filter(ft.clean_energy == True).all()[0][0]
    count_results_dirty = session.query(func.count(ppi.plant_id)).join(ft, ppi.fuel_id == ft.fuel_id).join(co, ppi.country_id == co.country_id).filter(co.country_long == country_name).filter(ft.clean_energy == False).all()[0][0]

    country_dict['clean_plant_count'] = count_results_clean
    country_dict['dirty_plant_count'] = count_results_dirty

    # power plant counts distributed by count
    pp_distribution_results = session.query(ft.primary_fuel, func.count(ft.primary_fuel)).join(ppi, ft.fuel_id == ppi.fuel_id).join(co, ppi.country_id == co.country_id).filter(co.country_long == country_name).group_by(ft.primary_fuel).all()

    pp_dist_df = pd.DataFrame(pp_distribution_results, columns = ['primary_fuel', 'count'])

    country_dict['plant_labels'] = pp_dist_df['primary_fuel'].tolist()
    country_dict['plant_counts_split'] = pp_dist_df['count'].tolist()


    # Greenhouse gases data pulling here:
    ghgs_years_results = session.query(distinct(ghg.year)).join(co, ghg.country_id == co.country_id).filter(co.country_long == country_name).order_by(ghg.year).all()
    ghgs_years_list = pd.DataFrame(ghgs_years_results, columns = ['years'])['years'].tolist()

    country_dict['greenhouse_years'] = ghgs_years_list

    # Query yearly totals specific to the country chosen
    country_dict['ghgs_totals'] = get_gh_yearly_totals(ghg, session, 'ghgs', country_name = country_name)
    country_dict['co2_totals'] = get_gh_yearly_totals(ghg, session, 'co2', country_name = country_name)
    country_dict['ch4_totals'] = get_gh_yearly_totals(ghg, session, 'ch4', country_name = country_name)
    country_dict['n2o_totals'] = get_gh_yearly_totals(ghg, session, 'n2o', country_name = country_name)
    
    session.close()

    # return country totals
    return jsonify(country_dict)


def get_gh_yearly_totals(ghg_table, session, gas_type, country_name = False):
    '''
    function queries DB to find total greenhouse gas emissions on a yearly basis
    
    @PARAMS: 
    ghg_table: greenhouse gases table object
    session: sqlalchemy session -> session = Session(engine)
    gas_type: type of greenhouse gas
    country_name: specific country name
    
    @Returns:
    total_floats: list of ghg totals on a yearly basis
    '''
    
    if country_name:
        
        totals_results = session.query(func.sum(ghg_table.value)).join(co, ghg.country_id == co.country_id).filter(ghg_table.category_short == gas_type).filter(co.country_long == country_name).group_by(ghg_table.year).order_by(ghg_table.year).all()
        totals_list = pd.DataFrame(totals_results, columns = ['totals'])['totals'].tolist()
        totals_floats = [float(x) for x in totals_list]
        
    else:
        
        totals_results = session.query(func.sum(ghg_table.value)).filter(ghg_table.category_short == gas_type).group_by(ghg_table.year).order_by(ghg_table.year).all()
        totals_list = pd.DataFrame(totals_results, columns = ['totals'])['totals'].tolist()
        totals_floats = [float(x) for x in totals_list]
    
    return totals_floats



if __name__ == "__main__":
    app.run(debug=True)