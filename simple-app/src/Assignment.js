import React, { useEffect, useState } from "react";
import GradeAssignment from "./GradeAssingment";


function Assignment({user}){

  const [assignments, setAssgs] = useState([])
  const [view, setView] = useState('')

  function gradeSection(id){
    setView(id)
  }

  useEffect( () => {
    fetch(`http://127.0.0.1:5000/assignments/${user.email}`, {
    }).then((r) => {
      if (r.ok) {
        r.json().then( (resp) => setAssgs(resp))
      } else{
        r.json().then( (err) => console.log(err))
      }
    })
  }, [])

  return (
    <div>
      {view === '' ? <div id="assg">
    <table className="styled-table">
      <thead>
        <tr>
          <th>id</th>
          <th>title</th>
          <th>grade</th>
          {user.email === "daniel07escalona@gmail.com" ? <th>student</th>: null}
          <th></th>
        </tr>
      </thead>
      <tbody>
        {assignments.map( assObj => <tr key={assObj.id}>
         <td>{assObj.id}</td>
         <td><a href={assObj.url}>{assObj.title}</a></td>
         {assObj.grade >= 0 ? <td>{assObj.grade}</td>: <td>Not graded yet</td>}
         {user.email === "daniel07escalona@gmail.com" ? <th>{assObj.student}</th>: null}
         {user.Role_in_company === 'pro'? <td><button onClick={() => gradeSection(assObj.id)}>Grade</button></td> : null}
        </tr>)}
      </tbody>
    </table>
  </div>: <GradeAssignment user={user} id={view} />}
    </div>
  )
}

export default Assignment

