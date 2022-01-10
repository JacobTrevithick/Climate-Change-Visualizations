DROP TABLE IF EXISTS power_plants_info;
DROP TABLE IF EXISTS countries;
DROP TABLE IF EXISTS power_plant_names;
DROP TABLE IF EXISTS greenhouse_gases;
DROP TABLE IF EXISTS power_plant_gen_stats;


CREATE TABLE IF NOT EXISTS countries (
	country_id INT PRIMARY KEY,
	country_long TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS power_plant_names (
	plant_id INT PRIMARY KEY,
	plant_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS fuel_types (
	fuel_id INT PRIMARY KEY,
	primary_fuel VARCHAR(100) NOT NULL,
 	clean_energy BOOLEAN NOT NULL 
);


CREATE TABLE IF NOT EXISTS power_plants_info (
	plant_id INT PRIMARY KEY,
	country_id INT NOT NULL,
	fuel_id INT NOT NULL,
    capacity_mw DECIMAL NOT NULL,
	latitude DECIMAL NOT NULL,
	longitude DECIMAL NOT NULL,
    FOREIGN KEY (country_id) REFERENCES countries(country_id),
	FOREIGN KEY (plant_id) REFERENCES power_plant_names (plant_id),
	FOREIGN KEY (fuel_id) REFERENCES fuel_types(fuel_id)
);




CREATE TABLE IF NOT EXISTS greenhouse_gases (
	country_id INT NOT NULL,
	category_short TEXT NOT NULL,
    year INT NOT NULL,
	value DECIMAL NOT NULL,
	PRIMARY KEY (country_id, category_short, year),
	FOREIGN KEY (country_id) REFERENCES countries(country_id)
);

CREATE TABLE IF NOT EXISTS power_plant_gen_stats (
	plant_id INT NOT NULL,
	year INT NOT NULL,
	generated_gwh DECIMAL,
	estimated_gwh DECIMAL,
	generation_data_source TEXT,
	PRIMARY KEY(plant_id, year),
	FOREIGN KEY(plant_id) REFERENCES power_plant_names(plant_id)
);








