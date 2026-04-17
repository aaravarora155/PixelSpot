// If you're running this locally in VS Code use the commands:
// npm install
// to install the node modules and
// npm run dev
// to launch your react project in your browser
import React from 'react';
import ReactDOM from 'react-dom';
import pi from "./math.js"
import { doublePi, triplePi } from "./math.js"

const name = "Aarav";
const list = <ul>
    <li>A</li>
    <li>B</li>
    <li>C</li>
</ul>;

function Heading() {
    return <h1>Hello {name}!</h1>;
}
function List() {
    return <ul>
        <li>I like legos</li>
        <li>I like coding</li>
        <li>I like tacos</li>
        <li>My Lucky Number is {Math.floor(Math.random() * 100 * (pi + doublePi() + triplePi()))}</li>
    </ul>;
}

ReactDOM.render(
    <div>
        <Heading />
        <List />
        <p>I am learning about react. I love creating HTML code this way!</p>
        <p style={{ color: "red" }}>Created by {name}</p>
        <p id="copyright">Copyright {new Date().getFullYear()}</p>
    </div>,
    document.getElementById('root')
);