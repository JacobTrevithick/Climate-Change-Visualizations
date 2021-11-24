CREATE TABLE IF NOT EXISTS countries (
	country_id INT PRIMARY KEY,
	country_long TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS power_plant_names (
	plant_id INT PRIMARY KEY,
	name TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS power_plants_info (
	country_id INT NOT NULL,
	plant_id INT NOT NULL,
    capacity_mw DECIMAL NOT NULL,
	latitude DECIMAL NOT NULL,
	longitude DECIMAL NOT NULL,
	primary_fuel VARCHAR(100) NOT NULL,
 	clean_energy BOOLEAN NOT NULL, 
    FOREIGN KEY (country_id) REFERENCES countries(country_id),
	FOREIGN KEY (plant_id) REFERENCES power_plant_names (plant_id)
);

CREATE TABLE IF NOT EXISTS greenhouse_gases (
	country_id INT NOT NULL,
	category_short TEXT NOT NULL,
    year INT NOT NULL,
	value DECIMAL NOT NULL,
	FOREIGN KEY (country_id) REFERENCES countries(country_id)
);

CREATE TABLE IF NOT EXISTS power_plant_gen_stats (
	plant_id INT NOT NULL,
	generation_gwh_2013 DECIMAL,
	generation_gwh_2014 DECIMAL,
	generation_gwh_2015 DECIMAL,
	generation_gwh_2016 DECIMAL,
	generation_gwh_2017 DECIMAL,
	generation_gwh_2018 DECIMAL,
	generation_gwh_2019 DECIMAL,
	generation_data_source TEXT,
	estimated_generation_gwh_2013 DECIMAL,
	estimated_generation_gwh_2014 DECIMAL,
	estimated_generation_gwh_2015 DECIMAL,
	estimated_generation_gwh_2016 DECIMAL,
	estimated_generation_gwh_2017 DECIMAL,
	FOREIGN KEY (plant_id) REFERENCES power_plant_names (plant_id)
);








