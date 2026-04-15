import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express.Router();
const port = 3000;

const db = new pg.Client({
  user: "main",
  host: "localhost",
  database: "webdev_vsyb",
  password: "ZJPFb7FKnVL5JsK13DuavZc54VBeoyF1",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;

let users = [
  { id: 1, name: "Angela", color: "teal" },
  { id: 2, name: "Jack", color: "powderblue" },
];
async function dbInit(){
  await db.query("DROP TABLE IF EXISTS countries");
  await db.query("CREATE TABLE IF NOT EXISTS countries(id SERIAL PRIMARY KEY, country_code CHAR(2) NOT NULL UNIQUE, country_name VARCHAR(50) NOT NULL)");
  await db.query("CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, name VARCHAR(15) NOT NULL UNIQUE, color VARCHAR(15) NOT NULL)");
  await db.query("CREATE TABLE IF NOT EXISTS visited_countries(id SERIAL PRIMARY KEY, country_code CHAR(2) NOT NULL, user_id INTEGER REFERENCES users(id))");
  await db.query("COPY countries FROM '.\\33.5 Family Travel Tracker\\countries.csv' DELIMITER ',' CSV HEADER");
}

await dbInit;

function getUser(id) {
  return users.find((user) => user.id == id);
}

async function loadUsers() {
  const result = await db.query("SELECT * FROM users");
  users = result.rows;
}

async function checkVisited(id) {
  const result = await db.query("SELECT country_code FROM visited_countries WHERE user_id = $1", [id]);
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}
app.get("/", async (req, res) => {
  loadUsers();
  const countries = await checkVisited(currentUserId);
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: getUser(currentUserId).color
  });
});
app.post("/add", async (req, res) => {
  const input = req.body["country"];
  const countries = await checkVisited(currentUserId);

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    const data = result.rows[0];
    const countryCode = data.country_code;
    try {
      if (countries.includes(countryCode)) {
        res.render("index.ejs", { countries: countries, total: countries.length, users: users, color: getUser(currentUserId).color, error: "Country already visited!" });
      }
      else {
        await db.query(
          "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
          [countryCode, currentUserId]
        );
        res.redirect("/");
      }
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    res.render("index.ejs", { countries: countries, total: countries.length, users: users, color: getUser(currentUserId).color, error: "Country not found!" });
  }
});
app.post("/user", async (req, res) => {
  if (req.body.add == undefined) {
    currentUserId = req.body.user;
    res.redirect("/");
  }
  else {
    res.render("new.ejs");
  }
});

app.post("/new", async (req, res) => {
  //Hint: The RETURNING keyword can return the data that was inserted.
  //https://www.postgresql.org/docs/current/dml-returning
  try {
    const id = await db.query("INSERT INTO users (name, color) VALUES ($1, $2) RETURNING id", [req.body.name, req.body.color]);
    users.push({ id: id.rows[0].id, name: req.body.name, color: req.body.color });
    currentUserId = id.rows[0].id;
    const countries = await checkVisited(currentUserId);
    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      users: users,
      color: getUser(currentUserId).color
    });
  }
  catch (err) {
    currentUserId = 1;
    const countries = await checkVisited(currentUserId);
    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      users: users,
      color: getUser(currentUserId).color
    });
    //alert("User Already Added!");
  }
});

export default app;