//Install packages using: npm i body-parser express
//Run website on localhost:3000
import express from "express";
const app = express.Router();
const port = 3000;
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index");
})

app.post("/check", (req, res) => {
    const password = req.body["password"];
    if (password === "ILoveProgramming") {
        res.sendFile(__dirname + "/public/secret");
    }
    else {
        res.sendFile(__dirname + "/public/index");
    }
})
export default app;