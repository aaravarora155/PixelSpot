import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import env from "dotenv";

env.config();

const app = express();
const port = 3000;
const saltRounds = 10;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL_1,
  ssl: {
    rejectUnauthorized: false
  }
});

// Catch unexpected idle connection errors (prevents server crash)
db.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

async function dbInit() {
  await db.query("CREATE TABLE IF NOT EXISTS userDetails (id SERIAL PRIMARY KEY, username VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL)");
}

await dbInit();

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const result = await db.query("SELECT * FROM userDetails WHERE username = $1", [username]);
    if (result.rows.length > 0) {
      res.send("User already exists");
    } else {
      await bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.log(err);
        } else {
          console.log(await db.query("INSERT INTO userDetails(username, password) VALUES ($1, $2)", [username, hash]));
          res.render("secrets.ejs");
        }
      });

    }
  } catch (err) {
    console.log(err);
  }

});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const result = await db.query("SELECT * FROM userDetails WHERE username = $1", [username]);
    if (result.rows.length > 0 && result != undefined) {
      bcrypt.compare(password, result.rows[0].password, (err, isMatch) => {
        if (err) {
          console.log(err);
        } else {
          if (isMatch) {
            res.render("secrets.ejs");
          } else {
            res.send("Invalid credentials");
          }
        }
      });
    } else {
      res.send("Invalid credentials");
    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
