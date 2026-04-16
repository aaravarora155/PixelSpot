import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

const app = express.Router();
const port = 3000;

const db = new pg.Client({
  connectionString:process.env.PG_CONNECTION_STRING || "postgresql://main:ZJPFb7FKnVL5JsK13DuavZc54VBeoyF1@dpg-d7fv57reo5us73b9hdo0-a.oregon-postgres.render.com/webdev_vsyb",
  ssl:{
    rejectUnauthorized: false
  }
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Helper function to create table if it doesn't exist
async function initializeDB() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS books (
                id SERIAL PRIMARY KEY,
                isbn VARCHAR(20) UNIQUE,
                title VARCHAR(255) NOT NULL,
                author VARCHAR(255),
                rating INTEGER DEFAULT 1 CHECK (rating >= 1 AND rating <= 5),
                notes TEXT,
                date_read DATE DEFAULT CURRENT_DATE
            );
        `);
        console.log("Database initialized properly.");
    } catch (err) {
        console.error("Error creating table:", err);
    }
}
initializeDB();

let currentSort = "recency";

async function getBooks() {
    let orderClause = "ORDER BY date_read DESC";
    if (currentSort === "rating") {
        orderClause = "ORDER BY rating DESC";
    } else if (currentSort === "title") {
        orderClause = "ORDER BY title ASC";
    }

    const result = await db.query(`SELECT id, isbn, title, author, rating, notes, date_read AS "dateRead" FROM books ${orderClause}`);
    return result.rows;
}

app.get("/", async (req, res) => {
    try {
        const books = await getBooks();
        res.render("index.ejs", { books, currentSort });
    } catch (err) {
        console.log(err);
        res.render("index.ejs", { books: [], currentSort });
    }
});

app.get("/sort/:sort", (req, res) => {
    const validSorts = ["recency", "rating", "title"];
    if (validSorts.includes(req.params.sort)) {
        currentSort = req.params.sort;
    }
    res.redirect(req.baseUrl);
});

app.post("/add", async (req, res) => {
    const isbn = req.body.isbn;
    try {
        // Check if book already exists
        const checkResult = await db.query("SELECT * FROM books WHERE isbn = $1", [isbn]);
        if (checkResult.rows.length > 0) {
            // Already added
            return res.redirect(req.baseUrl);
        }

        // Fetch from OpenLibrary
        const response = await axios.get(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
        const bookData = response.data[`ISBN:${isbn}`];

        if (bookData) {
            const title = bookData.title;
            const author = bookData.authors ? bookData.authors[0].name : "Unknown Author";

            // Insert book entry
            const result = await db.query(
                "INSERT INTO books (isbn, title, author, rating, notes) VALUES ($1, $2, $3, $4, $5) RETURNING id",
                [isbn, title, author, 1, "Enter your notes here..."]
            );

            // Redirect to edit page
            res.redirect(`${req.baseUrl}/editPage/${result.rows[0].id}`);
        } else {
            console.log("Book not found on OpenLibrary");
            res.redirect(req.baseUrl); // Consider adding error handling/flash messages in UI later
        }
    } catch (error) {
        console.log("Error adding book:", error.message);
        res.redirect(req.baseUrl);
    }
});

app.get("/editPage/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const result = await db.query("SELECT id, isbn, title, author, rating, notes, date_read AS \"dateRead\" FROM books WHERE id = $1", [id]);
        if (result.rows.length > 0) {
            res.render("edit.ejs", { book: result.rows[0] });
        } else {
            res.redirect(req.baseUrl);
        }
    } catch (err) {
        console.log(err);
        res.redirect(req.baseUrl);
    }
});

app.post("/edit/:id", async (req, res) => {
    const id = req.params.id;
    const { rating, notes, dateRead } = req.body;
    try {
        await db.query(
            "UPDATE books SET rating = $1, notes = $2, date_read = $3 WHERE id = $4",
            [rating, notes, dateRead, id]
        );
        res.redirect(req.baseUrl);
    } catch (err) {
        console.log(err);
        res.redirect(req.baseUrl);
    }
});

app.get("/view/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const result = await db.query("SELECT id, isbn, title, author, rating, notes, date_read AS \"dateRead\" FROM books WHERE id = $1", [id]);
        if (result.rows.length > 0) {
            res.render("view.ejs", { book: result.rows[0] });
        } else {
            res.redirect(req.baseUrl);
        }
    } catch (err) {
        console.log(err);
        res.redirect(req.baseUrl);
    }
});

app.post("/delete/:id", async (req, res) => {
    const id = req.params.id;
    try {
        await db.query("DELETE FROM books WHERE id = $1", [id]);
        res.redirect(req.baseUrl);
    } catch (err) {
        console.log(err);
        res.redirect(req.baseUrl);
    }
});

export default app;