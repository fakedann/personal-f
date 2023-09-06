import React, { useState } from "react";
import Complaints from "./Complaints";

function CreateComplaint({user}){

  const [complaint, setComplaint] = useState({assgid: 0, message: ''})
  const [view, setView] = useState('')

  function handleChange(event) {
    const name = event.target.name;
    let value = event.target.value;

    setComplaint({
      ...complaint,
      [name]: value,
    });
  }

  function handleSubmit(event){
    event.preventDefault()
    const newComplaint = new FormData()
    newComplaint.append('assgid', complaint.assgid)
    newComplaint.append('message', complaint.message)

    fetch(`http://127.0.0.1:5000/create_complaint/${user.email}`, {
      method: "POST",
      body: newComplaint,
    }).then((r) => {
      if (r.ok) {
        r.json().then( (resp) => console.log(resp))
      } else{
        r.json().then( (err) => console.log(err))
      }
    })
    setView('e')
  }

  if (view !== ''){
    return <Complaints user={user}/>
  }

  return (
   <div>
     <p>Please provide the correct assignment id:</p>
     <form onSubmit={handleSubmit}>
        <label>Assingment id:</label>
        <input
          type="number"
          name="assgid"
          onChange={handleChange}
          value={complaint.assgid}
        />
        <label>Message:</label>
        <input
          type="type"
          name="message"
          onChange={handleChange}
          value={complaint.message}
        />
       <button className="botones" type="submit">Submit</button>
      </form>
      <button id="cancelBtn" className="botones" onClick={ () => setView('e')}>Cancel</button>
   </div>
  )
}

export default CreateComplaint