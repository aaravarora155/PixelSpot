import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import env from "dotenv";

env.config();

const app = express.Router();
const port = 3000;
const saltRounds = 10;

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static("public")); // Handled by monolith server.js
app.use(session({
  name: "auth-lv3-session",
  secret: "A5GHIuJklhgbHFHSs",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL_1,
  ssl: {
    rejectUnauthorized: false
  }
});

// Catch unexpected connection errors
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

app.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/34.5-Authentication-Lv.3/");
  });
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.get("/secrets", (req, res) => {
  req.isAuthenticated() ? res.render("secrets.ejs") : res.redirect("./");
});

app.get("/auth/google", passport.authenticate("google-lv3", {
  scope: ["profile", "email"]
}));

app.get("/auth/google/secrets", passport.authenticate("google-lv3", {
  successRedirect: "/34.5-Authentication-Lv.3/secrets",
  failureRedirect: "/34.5-Authentication-Lv.3/login"
}));

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
          const result = await db.query("INSERT INTO userDetails(username, password) VALUES ($1, $2) RETURNING *", [username, hash]);
          const user = result.rows[0];
          req.login(user, (err) => {
            if (err) {
              console.log(err);
              res.redirect("./login");
            } else {
              res.redirect("./secrets");
            }
          });
        }
      });

    }
  } catch (err) {
    console.log(err);
  }

});

app.post("/login",
  passport.authenticate("local-lv3", {
    successRedirect: "./secrets",
    failureRedirect: "./login"
  })
);

passport.use("google-lv3", new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://pixelspot.onrender.com/34.5-Authentication-Lv.3/auth/google/secrets",
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
  scope: ["profile", "email"],
}, async (accessToken, refreshToken, profile, cb) => {
  try {
    const result = await db.query("SELECT * FROM userDetails WHERE username = $1", [profile.email]);
    if (result.rows.length == 0) {
      const newUser = await db.query("INSERT INTO userDetails(username, password) VALUES ($1, $2) RETURNING *", [profile.email, "google"]);
      cb(null, newUser.rows[0]);
    } else {
      cb(null, result.rows[0]);
    }
  } catch (err) {
    cb(err);
  }
}));

passport.use("local-lv3", new Strategy(async function verify(username, password, cb) {
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

export default app;