//Install Packages using: npm i inquirer qr-image *Run Command in terminal*
import inquirer from "inquirer";
import qr from "qr-image";
import fs from "fs";

inquirer
    .prompt([
    {
        name: "url",
        type: "input",
        message: "What is the URL of the website?"
    },
])
    .then(answers => {
    const url=answers.url;
    const qr_image=qr.image(url,{type:"png"})

    qr_image.pipe(fs.createWriteStream("./images/qr_code.png"));
    fs.writeFile("./url.txt",url,(err) => {
        if (err) throw err;
        console.log("File Saved")
    })
})
    .catch(err => {
    console.log(err);
})