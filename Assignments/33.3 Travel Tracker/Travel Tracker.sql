CREATE TABLE IF NOT EXISTS countries(
	id SERIAL PRIMARY KEY,
	country_code CHAR(2) NOT NULL UNIQUE,
	country_name VARCHAR(50)
);

COPY countries FROM 'C:\Web Applications\Hosting\Assignments\33.3 Travel Tracker\countries.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE IF NOT EXISTS visited_countries(
	id SERIAL PRIMARY KEY,
	country_code CHAR(2) NOT NULL UNIQUE
);
