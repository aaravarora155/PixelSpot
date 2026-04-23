import React from "react";

function Note(props) {
  function onDelete(event){
    event.preventDefault();
    const {title, content} = event.target;
    
  }
  return (
    <div className="note">
      <h1>{props.title}</h1>
      <p>{props.content}</p>
      <button onClick={onDelete}>DELETE</button>
    </div>
  );
}

export default Note;
