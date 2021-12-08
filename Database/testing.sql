SELECT gg.year, SUM(gg.value)
FROM greenhouse_gases AS gg
JOIN countries AS c ON gg.country_id = c.country_id
WHERE gg.category_short = 'ghgs'
GROUP BY gg.year
ORDER BY gg.year ASC;

SELECT * FROM greenhouse_gases;


SELECT COUNT(*)
FROM power_plants_info
WHERE clean_energy = true;

SELECT COUNT(primary_fuel), primary_fuel
FROM power_plants_info
GROUP BY primary_fuel;

SELECT DISTINCT year
FROM greenhouse_gases
ORDER BY year ASC;



