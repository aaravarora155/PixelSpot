import React from "react";

var isLoggedIn = false;

function renderConditionally(){
  return isLoggedIn ? <h1>Hello</h1> : <form className="form">
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
}

function App() {
  return (
    <div className="container">
      {renderConditionally()}
    </div>
  );
}

export default App;
