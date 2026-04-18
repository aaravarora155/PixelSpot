import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import env from "dotenv";

env.config();

const app = express();
const port = 3000;
const saltRounds = 10;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({
  secret: "A5GHIuJklhgbHFHSs",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

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

app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.get("/secrets", (req, res) => {
  req.isAuthenticated() ? res.render("secrets.ejs") : res.redirect("/");
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

app.post("/login",
  passport.authenticate("local", {
    successRedirect: "/secrets",
    failureRedirect: "/login"
  })
);

passport.use(new Strategy(async function verify(username, password, cb) {
  try {
    const result = await db.query("SELECT * FROM userDetails WHERE username = $1", [username]);
    if (result.rows.length > 0 && result != undefined) {
      const user = result.rows[0];
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return cb(err);
        } else {
          if (isMatch) {
            return cb(null, user);
          } else {
            return cb(null, false);
          }
        }
      });
    } else {
      return cb("User not found");
    }
  } catch (err) {
    return cb(err);
  }
}));

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
