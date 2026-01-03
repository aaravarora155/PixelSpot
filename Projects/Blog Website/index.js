//Install dependencies using: npm i express body-parser
import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let authors = [];
let titles = [];

function storeFile(name,title,body) {
    let postPath = 'posts/' + title + '.txt';
    const message = "Author: " + name + "\n\n" + "Title: " + title + "\n\n" + "Body: " + body;
    fs.writeFile(postPath, message, (err) => {
        if (err) throw err;
        console.log("File Saved")
    })
    authors.push(name);
    titles.push(title);
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
    res.render("index.ejs",{"authors":authors,"titles":titles});
})
app.post("/edit", (req, res) => {

})
app.post("/delete", (req, res) => {
    console.log(authors+"-"+titles);
    authors=authors.splice(authors.indexOf(req.body["author"]),1);
    titles=titles.splice(titles.indexOf(req.body["title"]),1);
    console.log(authors+"-"+titles);
    res.render("index.ejs",{"authors":authors,"titles":titles});
})
app.get("/view", (req, res) => {

})
app.listen(port, () => {
    console.log("Server running on port " + port);
})
