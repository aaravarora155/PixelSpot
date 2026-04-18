import React from "react";
import notes from "../notes";

function submitNote(event, props) {
  event.preventDefault();
  const title = event.target.title.value;
  const content = event.target.content.value;

  notes.push({ id: notes.length + 1, title: title, content: content });

  document.getElementById("title").value = "";
  document.getElementById("content").value = "";
  console.log(notes);
}

function getClick(){
  return document.getElementById("add")
}

function CreateArea(props) {
  return (
    <div>
      <form>
        <input id="title" name="title" placeholder="Title" />
        <textarea id="content" name="content" placeholder="Take a note..." rows="3" />
        <button onClick={(event) => submitNote(event, props)} type="submit" id="add">Add</button>
      </form>
    </div>
  );
}

export default CreateArea;
export {getClick};
