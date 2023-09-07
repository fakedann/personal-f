import React, { useEffect, useState } from "react";
import ReviewComplaint from "./ReviewComplaint";
import CreateComplaint from "./CreateComplaint";

function Complaints({user}){

  const [complaints, setComplaints] = useState([])
  const [view, setView] = useState('')

  useEffect( () => {
    fetch(`http://127.0.0.1:5000/complaints/${user.email}`, {
    }).then((r) => {
      if (r.ok) {
        r.json().then( (resp) => setComplaints(resp))
      } else{
        r.json().then( (err) => console.log(err))
      }
    })
  }, [])

  if (view === 'create'){
    return <CreateComplaint user={user}/>
  }else if(view !== ''){
    return <ReviewComplaint compl={view} user={user}/>
  }

  return (

    <div id="compl">
      {user.email === "daniel07escalona@gmail.com" ? null: <button className="botones" onClick={ () => setView('create')}>File Complaint</button>}
      {complaints.length === 0 ? <p>You have no complaints to review.</p> : <table className="styled-table">
            <thead>
              <tr>
                <th>Assingment id</th>
                <th>status</th>
                {user.email === "daniel07escalona@gmail.com" ? <th>student</th>: null}
                {user.email === "daniel07escalona@gmail.com" ? <th></th>: <th>Your message</th>}
              </tr>
            </thead>
            <tbody>
              {complaints.map( complObj => <tr key={complObj.id}>
              <td>{complObj.assg_id}</td>
              <td>{complObj.status === 0 ? "Pending" : <b>Reviewed</b>}</td>
              {user.email === "daniel07escalona@gmail.com" ? <th>{complObj.student}</th>: null}
              {user.email === "daniel07escalona@gmail.com" && complObj.status === 0? <td><button onClick={ () => setView(complObj)}>Review</button></td> : <td><p>{complObj.message}</p></td>}
              </tr>)}
            </tbody>
          </table> }
    </div>
  )
}

export default Complaints