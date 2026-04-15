//Install dependencies using: npm i express body-parser
import express from "express";
import bodyParser from "body-parser";

const app = express.Router();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let authors = [];
let titles = [];
let posts = [];

function storeFile(name, title, body) {
    authors.push(name);
    titles.push(title);
    posts.push(body);
}

app.get("/", (req, res) => {
    res.render("index.ejs");
})
app.post("/create", (req, res) => {
    res.render("create.ejs");
})
app.post("/submit", (req, res) => {
    const name = req.body["author"];
    const title = req.body["title"];
    const body = req.body["bodyPost"];
    storeFile(name, title, body);
    res.render("index.ejs", { "authors": authors, "titles": titles });
})
app.post("/edit", (req, res) => {
    const title = req.body["title"];
    const body = req.body["bodyPost"];

    titles.forEach(title1 => {
        if (title1 === title) {
            const index = titles.indexOf(title1);
            posts[index] = body;
            res.render("index.ejs", { "message": "<p>Edited Successfully!</p>", "type": true });
        }
    })
})
app.post("/view", (req, res) => {
    const title = req.body["title"];

    titles.forEach(title1 => {

        if (title1 === title) {
            const index = titles.indexOf(title1);

            const post = `<h3>${titles[index]}</h3><p>Written by: ${authors[index]}</p><p>Post: ${posts[index]}<p>`;
            res.render("index.ejs", { "message": post, "type": true })
        }
    })


})
app.post("/delete", (req, res) => {
    const title = req.body["title"];

    titles.forEach(title1 => {
        if (title1 === title) {
            const index = titles.indexOf(title1);
            posts.splice(index, 1);
            titles.splice(index, 1);
            authors.splice(index, 1);
            res.render("index.ejs", { "message": "<p>Deleted Successfully!<p/>", "type": true })
        }
    })
})
export default app;