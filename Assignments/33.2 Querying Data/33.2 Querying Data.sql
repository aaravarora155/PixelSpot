DROP TABLE IF EXISTS world_food;
CREATE TABLE IF NOT EXISTS world_food(
	id SERIAL PRIMARY KEY,
	country VARCHAR(100),
	rice_production FLOAT,
	wheat_production FLOAT
);

--Edit Path to your CSV file
COPY world_food(country, rice_production, wheat_production) FROM 'C:\Web Applications\Hosting\Assignments\33.2 Querying Data\world-food.csv' DELIMITER ',' CSV HEADER;
SELECT * FROM world_food WHERE wheat_production>20 AND country LIKE 'U' || '%';
--Column(s), Table, Condition, Checks if Something is contained in a word