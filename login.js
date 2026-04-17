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
// Middleware handled by monolith server.js

const db = new pg.Client({
  connectionString: process.env.PG_CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false
  }
});

db.connect();

async function dbInit() {
  await db.query("CREATE TABLE IF NOT EXISTS masterUsers (id SERIAL PRIMARY KEY, username VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL)");
}

await dbInit();

app.get("/", (req, res) => {
  res.redirect("/Login");
});

app.get("/home", (req, res) => {
  req.isAuthenticated() ? res.redirect("/Home") : res.redirect("/Login");
});

app.get("/auth/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

app.get("/auth/google/home", passport.authenticate("google", {
  successRedirect: "/Home",
  failureRedirect: "/Login"
}));

app.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const result = await db.query("SELECT * FROM masterUsers WHERE username = $1", [username]);
    if (result.rows.length > 0) {
      res.send("User already exists");
    } else {
      await bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.log(err);
        } else {
          const result = await db.query("INSERT INTO masterUsers(username, password) VALUES ($1, $2) RETURNING *", [username, hash]);
          const user = result.rows[0];
          req.login(user, (err) => {
            if (err) {
              console.log(err);
              res.redirect("/Login");
            } else {
              res.redirect("/Home");
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
  passport.authenticate("local", {
    successRedirect: "/Home",
    failureRedirect: "/Login"
  })
);

app.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/Login");
  });
});

passport.use("google", new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID_MAIN,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET_MAIN,
  callbackURL: "https://pixelspot.onrender.com/auth/google/home",
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
  scope: ["profile", "email"],
}, async (accessToken, refreshToken, profile, cb) => {
  try {
    const result = await db.query("SELECT * FROM masterUsers WHERE username = $1", [profile.email]);
    if (result.rows.length == 0) {
      const newUser = await db.query("INSERT INTO masterUsers(username, password) VALUES ($1, $2) RETURNING *", [profile.email, "google"]);
      cb(null, newUser.rows[0]);
    } else {
      cb(null, result.rows[0]);
    }
  } catch (err) {
    cb(err);
  }
}));

passport.use("local", new Strategy(async function verify(username, password, cb) {
  try {
    const result = await db.query("SELECT * FROM masterUsers WHERE username = $1", [username]);
    if (result.rows.length > 0) {
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