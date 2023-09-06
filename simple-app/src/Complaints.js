import React, { useEffect, useState } from "react";
import ReviewComplaint from "./ReviewComplaint";

function Complaints({user}){

  const [complaints, setComplaints] = useState([])
  const [view, setView] = useState('')

  useEffect( () => {
    console.log('inside')
    fetch(`http://127.0.0.1:5000/complaints/${user.email}/${user.Role_in_company}`, {
    }).then((r) => {
      if (r.ok) {
        r.json().then( (resp) => setComplaints(resp))
      } else{
        r.json().then( (err) => console.log(err))
      }
    })
  }, [])

  if (view !== ''){
    return <ReviewComplaint compl={view} user={user}/>
  }

  return (

    <div id="compl">
      {complaints.length === 0 ? <p>You have no complaints to review.</p> : <table className="styled-table">
            <thead>
              <tr>
                <th>id</th>
                <th>status</th>
                {user.email === "joseleon@gmail.com" ? <th></th>: <th>Message</th>}
              </tr>
            </thead>
            <tbody>
              {complaints.map( complObj => <tr key={complObj.id}>
              <td>{complObj.assg_id}</td>
              <td>{complObj.status === 0 ? "Pending" : <b>Reviewed</b>}</td>
              {user.email === "joseleon@gmail.com" ? <td><button onClick={ () => setView(complObj.id)}>Review</button></td> : <p>{complObj.message}</p>}
              </tr>)}
            </tbody>
          </table> }
    </div>
  )
}

export default Complaints