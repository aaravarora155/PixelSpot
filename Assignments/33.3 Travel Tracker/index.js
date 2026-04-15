//Install packages using: npm i body-parser express pg
import express from "express";
import bodyParser from "body-parser";
import pg from "pg"

const app = express.Router();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "data",
  port: 5432,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let numVisited = 0;
let visitedCountries = [];

db.connect();
async function getVisitInfo() {
  db.query("SELECT country_code FROM visited_countries", (err, res) => {
    if (err) {
      console.error("Error executing query", err.stack);
    }
    else {
      visitedCountries = [];
      res.rows.forEach((country) => {
        visitedCountries.push(country.country_code);
      })
      numVisited = visitedCountries.length;

    }
  })
}

getVisitInfo();

app.get("/", async (req, res) => {
  res.render("index.ejs", { countries: visitedCountries, total: numVisited });
});

app.post("/add", async (req, res) => {
  const country = req.body.country;
  const data = await db.query("SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';", [country.toLowerCase()]);
  if (data.rows.length > 0 && !visitedCountries.includes(data.rows[0].country_code)) {
    await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [data.rows[0].country_code]);
    getVisitInfo();
    res.redirect("/");
  }
  else if (data.rows.length == 0) {
    res.render("index.ejs", { countries: visitedCountries, total: numVisited, error: "Country not found!" });
  }
  else if (visitedCountries.includes(data.rows[0].country_code)) {
    res.render("index.ejs", { countries: visitedCountries, total: numVisited, error: "Country already visited!" });
  }

});

export default app;