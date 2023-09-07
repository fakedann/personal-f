import React, { useState } from "react";
import Assignment from "./Assignment";

function GradeAssignment({user, id}){

  const [grade, setGrade] = useState(0)
  const [view, setView] = useState('')

  function handleSubmit(e){
    e.preventDefault()
    const grad = new FormData()
    grad.append('id', id)
    grad.append('grade', grade)
    fetch(`http://127.0.0.1:5000/gradeAssignment`, {
      method: "POST",
      body: grad,
    }).then((r) => {
      if (r.ok) {
        r.json().then( () => null)
      } else{
        r.json().then( (err) => console.log(err))
      }
    })
    setView('d')
  }

  if (view !== '') {
    return <Assignment user={user}/>
  }


  return (
    <div className="homePage">
      <p>Grading assingment # {id}</p>
      <form onSubmit={handleSubmit}>
        <label>Score:</label>
        <input
          type="number"
          name="grade"
          onChange={ (e) => setGrade(e.target.value)}
          value={grade}
        />
       <button className="botones" type="submit">Submit</button>
      </form>
      <button id="cancelBtn" className="botones" onClick={ () => setView('e')}>Cancel</button>
 </div>
  )
}

export default GradeAssignment