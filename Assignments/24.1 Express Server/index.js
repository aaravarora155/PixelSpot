import express from "express";
const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send("<a href='./index.html'>text</a>");
})
app.post("/register", (req, res) => {
    res.sendStatus(400);
})
app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
