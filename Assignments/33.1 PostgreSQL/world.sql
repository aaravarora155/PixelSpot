DROP TABLE IF EXISTS capitals;

CREATE TABLE IF NOT EXISTS capitals(
    id SERIAL PRIMARY KEY,
    country VARCHAR(100),
    capital VARCHAR(100)
);

--Edit Path to your CSV file
COPY capitals FROM 'C:\Web Applications\Hosting\Assignments\33.1 PostgreSQL\capitals.csv' DELIMITER ',' CSV HEADER;