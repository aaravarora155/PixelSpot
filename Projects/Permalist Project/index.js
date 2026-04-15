import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express.Router();
const port = 3000;

const db = new pg.Client({
  connectionString:"postgresql://main:ZJPFb7FKnVL5JsK13DuavZc54VBeoyF1@dpg-d7fv57reo5us73b9hdo0-a.oregon-postgres.render.com/webdev_vsyb",
  ssl:{
    rejectUnauthorized: false
  }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
db.connect();

let items = [];

async function dbInit(){
  await db.query("CREATE TABLE IF NOT EXISTS items(id SERIAL PRIMARY KEY, title VARCHAR(100))");
}

await dbInit();

async function getItems() {
  const result = await db.query("SELECT * FROM items");
  items = result.rows;
}

app.get("/", async (req, res) => {
  await getItems();
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  const id = await db.query("INSERT INTO items (title) VALUES ($1) RETURNING id", [item]);
  items.push({ id: id.rows[0].id, title: item });
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const id = req.body.updatedItemId;
  await db.query("UPDATE items SET title = $1 WHERE id = $2", [req.body.updatedItemTitle, id]);
  await getItems();
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  await db.query("DELETE FROM items WHERE id = $1", [id]);
  res.redirect("/");
});

export default app;