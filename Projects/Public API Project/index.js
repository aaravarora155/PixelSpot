//Install packages using: npm i body-parser express axios
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express.Router();
const port = 3000;
const API_URL = "https://api.openuv.io/api/v1/uv";
const API_KEY = "openuv-4ms52rmk155s4o-io";

const options = {
    headers: { "x-access-token": API_KEY }
}

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    res.render("index.ejs");
})
app.post("/submit", async (req, res) => {
    const longitude = parseFloat(req.body["Longitude"]);
    const latitude = parseFloat(req.body["Latitude"]);
    if (longitude > 90 || longitude < -90 || latitude > 180 || latitude < -180 || isNaN(longitude) || isNaN(latitude)) {
        res.render("index.ejs", { "message": "Longitude must be between 90 and -90 and Latitude must be between 180 and -180" });
    }
    else {
        try {
            const result = await axios.get(API_URL + "?lat=" + latitude + "&lng=" + longitude, options);
            const uv = result.data.result.uv;
            let ps;
            if (uv <= 2) {
                ps = "You do not need to wear sunscreen";
            }
            else {
                ps = "You need to wear sunscreen";
            }

            res.render("index.ejs", { "message": "The UV is: " + uv + ", " + ps });
        }
        catch (err) {
            console.log(err);
        }
    }

})
export default app;
