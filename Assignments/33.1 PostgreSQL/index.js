//Install packages using: npm i body-parser express pg
import express from "express";
import bodyParser from "body-parser";
import pg from "pg"

const app = express.Router();
const port = 3000;

const db = new pg.Client({
  connectionString:process.env.PG_CONNECTION_STRING || "postgresql://main:ZJPFb7FKnVL5JsK13DuavZc54VBeoyF1@dpg-d7fv57reo5us73b9hdo0-a.oregon-postgres.render.com/webdev_vsyb",
  ssl:{
    rejectUnauthorized: false
  }
});

db.connect();

async function dbInit(){
  await db.query("DROP TABLE IF EXISTS capitals");
  await db.query("CREATE TABLE IF NOT EXISTS capitals(id SERIAL PRIMARY KEY, country VARCHAR(100), capital VARCHAR(100))");
  await db.query("COPY capitals FROM '.\\33.1 PostgreSQL\\capitals.csv' DELIMITER ',' CSV HEADER");
}

await dbInit();

let quiz = [
  { country: "France", capital: "Paris" },
  { country: "United Kingdom", capital: "London" },
  { country: "United States of America", capital: "New York" },
];

db.query("SELECT * FROM capitals", (err, res) => {
  if (err) {
    console.error("Error executing query", err.stack);
  }
  else {
    quiz = res.rows;
  }
})

let totalCorrect = 0;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentQuestion = {};

// GET home page
app.get("/", async (req, res) => {
  totalCorrect = 0;
  await nextQuestion();
  console.log(currentQuestion);
  res.render("index.ejs", { question: currentQuestion });
});

// POST a new post
app.post("/submit", (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = false;
  if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }

  nextQuestion();
  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

async function nextQuestion() {
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];

  currentQuestion = randomCountry;
}

export default app;
