import React, { useState } from "react";

function CreateArea(props) {
  // 1. Use state to track the input values
  const [note, setNote] = useState({
    title: "",
    content: ""
  });

  // 2. Update state whenever the user types
  function handleChange(event) {
    const { name, value } = event.target;

    setNote(prevNote => {
      return {
        ...prevNote,
        [name]: value
      };
    });
  }

  function submitNote(event) {
    // 3. Send the note back to the App component using the prop
    props.onAdd(note);
    
    // 4. Clear the input fields after adding
    setNote({
      title: "",
      content: ""
    });
    
    event.preventDefault();
  }

  return (
    <div>
      <form>
        <input
          name="title"
          onChange={handleChange}
          value={note.title}
          placeholder="Title"
        />
        <textarea
          name="content"
          onChange={handleChange}
          value={note.content}
          placeholder="Take a note..."
          rows="3"
        />
        <button onClick={submitNote}>Add</button>
      </form>
    </div>
  );
}

export default CreateArea;