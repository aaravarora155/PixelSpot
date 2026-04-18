import React, {useState} from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import notes from "../notes";
import {getClick} from "./CreateArea";

function createNote(note){
  return <Note
    key={note.id}
    title={note.title}
    content={note.content}
  />
}

function App() {
  const [isClicked, setIsClicked] = useState(false);

  function handleClick() {
    setIsClicked(true);
    return notes.map(createNote);
  }
  
  return (
    <div>
      <Header />
      <CreateArea/>
      {}
      <Footer />
    </div>
  );
}

export default App;
