import React, { useState } from "react";
import Complaints from "./Complaints";


function ReviewComplaint({compl, user}){

  const [view, setView] = useState('')
  const [updatedGrade, setUpdatedGrade] = useState({message: '', grade: 0})
  console.log(compl)


  function handleChange(event) {
    const name = event.target.name;
    let value = event.target.value;

    setUpdatedGrade({
      ...updatedGrade,
      [name]: value,
    });
  }

  function handleSubmit(event){
    event.preventDefault()
    const newGrade = new FormData()
    newGrade.append('message', updatedGrade.message)
    newGrade.append('grade', updatedGrade.grade)

    fetch(`http://127.0.0.1:5000/review_complaint/${compl}`, {
      method: "POST",
      body: newGrade,
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
      <p>rewview!!!</p>
      <form onSubmit={handleSubmit}>
        <label>Message:</label>
        <input
          type="text"
          name="message"
          onChange={handleChange}
          value={updatedGrade.message}
        />
        <label>New grade:</label>
        <input
          type="number"
          name="grade"
          onChange={handleChange}
          value={updatedGrade.grade}
        />
       <button className="botones" type="submit">Submit</button>
      </form>
      <button id="cancelBtn" className="botones" onClick={ () => setView('e')}>Cancel</button>
    </div>
  )
}

export default ReviewComplaint