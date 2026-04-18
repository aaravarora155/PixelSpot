import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";

env.config();

const app = express.Router();
const port = 3000;

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL_1,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Catch unexpected connection errors
db.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

let items = [];

async function dbInit() {
  await db.query("CREATE TABLE IF NOT EXISTS items(id SERIAL PRIMARY KEY, title VARCHAR(100), email VARCHAR(255))");
  
  // Migration: Add email column if it doesn't exist for existing tables
  await db.query(`
    DO $$ 
    BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='items' AND column_name='email') THEN
            ALTER TABLE items ADD COLUMN email VARCHAR(255);
        END IF;
    END $$;
  `);
}

await dbInit();

async function getItems(email) {
  const result = await db.query("SELECT * FROM items WHERE email = $1", [email]);
  items = result.rows;
  return items;
}

app.get("/", async (req, res) => {
  const email = req.user ? req.user.username : null;
  await getItems(email);
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const email = req.user ? req.user.username : null;
  const item = req.body.newItem;
  const id = await db.query("INSERT INTO items (title, email) VALUES ($1, $2) RETURNING id", [item, email]);
  res.redirect("./");
});

app.post("/edit", async (req, res) => {
  const email = req.user ? req.user.username : null;
  const id = req.body.updatedItemId;
  await db.query("UPDATE items SET title = $1 WHERE id = $2 AND email = $3", [req.body.updatedItemTitle, id, email]);
  res.redirect("./");
});

app.post("/delete", async (req, res) => {
  const email = req.user ? req.user.username : null;
  const id = req.body.deleteItemId;
  await db.query("DELETE FROM items WHERE id = $1 AND email = $2", [id, email]);
  res.redirect("./");
});

export default app;