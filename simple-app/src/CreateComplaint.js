import React, { useState, useEffect } from "react";
import Complaints from "./Complaints";

function CreateComplaint({user}){

  const [complaint, setComplaint] = useState({assgid: 0, message: ''})
  const [userAssignments, setAssignments] = useState([])
  const [view, setView] = useState('')
  const [error, setError] = useState('')
  const [selectVal, setSelect] = useState(0)

  useEffect( () => {
    fetch(`http://127.0.0.1:5000/user_assignments/${user.email}`, {
    }).then((r) => {
      if (r.ok) {
        r.json().then( (resp) => setAssignments(resp))
      } else{
        r.json().then( (err) => console.log(err))
      }
    })
  }, [])

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
    newComplaint.append('assgid', selectVal)
    newComplaint.append('message', complaint.message)

    fetch(`http://127.0.0.1:5000/create_complaint/${user.email}`, {
      method: "POST",
      body: newComplaint,
    }).then((r) => {
      if (r.ok) {
        r.json().then( () => setView('e'))
      } else{
        r.json().then( () => setError('e'))
      }
    })
    
  }

  if (view !== ''){
    return <Complaints user={user}/>
  }

  return (
   <div id="createComplaint">
     <p>Please provide the correct assignment id:</p>
     <form onSubmit={handleSubmit}>
        <label>Assingment id:</label>
        <select value={selectVal} onChange={ e => setSelect(e.target.value)}>
          {userAssignments.length > 0 ? userAssignments.map( assgnObj => <option key={assgnObj.id} value={assgnObj.id}>{assgnObj.id}</option>) : null}
        </select>
        <label>Message:</label>
        <input
          type="type"
          name="message"
          onChange={handleChange}
          value={complaint.message}
        />
       <button className="botones" type="submit">Submit</button>
       <button id="cancelBtn" className="botones" onClick={ () => setView('e')}>Cancel</button>
      </form>
    
      {error !== '' ? <p>Please, try again and submit one of your assignment ids.</p>: null}
   </div>
  )
}

export default CreateComplaint