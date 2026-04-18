import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";
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

// Catch unexpected connection errors (e.g. idle timeout)
db.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Helper function to create table if it doesn't exist
async function initializeDB() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS books (
                id SERIAL PRIMARY KEY,
                isbn VARCHAR(20),
                title VARCHAR(255) NOT NULL,
                author VARCHAR(255),
                rating INTEGER DEFAULT 1 CHECK (rating >= 1 AND rating <= 5),
                notes TEXT,
                date_read DATE DEFAULT CURRENT_DATE,
                email VARCHAR(255),
                UNIQUE(isbn, email)
            );
        `);
        // Migration: Add email column if it doesn't exist
        await db.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='books' AND column_name='email') THEN
                    ALTER TABLE books ADD COLUMN email VARCHAR(255);
                    ALTER TABLE books DROP CONSTRAINT IF EXISTS books_isbn_key;
                    ALTER TABLE books ADD CONSTRAINT books_isbn_email_key UNIQUE (isbn, email);
                END IF;
            END $$;
        `);
        console.log("Database initialized properly.");
    } catch (err) {
        console.error("Error creating table:", err);
    }
}
initializeDB();

let currentSort = "recency";

async function getBooks(email) {
    let orderClause = "ORDER BY date_read DESC";
    if (currentSort === "rating") {
        orderClause = "ORDER BY rating DESC";
    } else if (currentSort === "title") {
        orderClause = "ORDER BY title ASC";
    }

    const result = await db.query(`SELECT id, isbn, title, author, rating, notes, date_read AS "dateRead" FROM books WHERE email = $1 ${orderClause}`, [email]);
    return result.rows;
}

app.get("/", async (req, res) => {
    try {
        const email = req.user ? req.user.username : null;
        const books = await getBooks(email);
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
    const email = req.user ? req.user.username : null;
    try {
        // Check if book already exists for THIS user
        const checkResult = await db.query("SELECT * FROM books WHERE isbn = $1 AND email = $2", [isbn, email]);
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
                "INSERT INTO books (isbn, title, author, rating, notes, email) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
                [isbn, title, author, 1, "Enter your notes here...", email]
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
    const email = req.user ? req.user.username : null;
    try {
        const result = await db.query("SELECT id, isbn, title, author, rating, notes, date_read AS \"dateRead\" FROM books WHERE id = $1 AND email = $2", [id, email]);
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
    const email = req.user ? req.user.username : null;
    const { rating, notes, dateRead } = req.body;
    try {
        await db.query(
            "UPDATE books SET rating = $1, notes = $2, date_read = $3 WHERE id = $4 AND email = $5",
            [rating, notes, dateRead, id, email]
        );
        res.redirect(req.baseUrl);
    } catch (err) {
        console.log(err);
        res.redirect(req.baseUrl);
    }
});

app.get("/view/:id", async (req, res) => {
    const id = req.params.id;
    const email = req.user ? req.user.username : null;
    try {
        const result = await db.query("SELECT id, isbn, title, author, rating, notes, date_read AS \"dateRead\" FROM books WHERE id = $1 AND email = $2", [id, email]);
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
    const email = req.user ? req.user.username : null;
    try {
        await db.query("DELETE FROM books WHERE id = $1 AND email = $2", [id, email]);
        res.redirect(req.baseUrl);
    } catch (err) {
        console.log(err);
        res.redirect(req.baseUrl);
    }
});

export default app;