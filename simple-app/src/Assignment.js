import React, { useEffect, useState } from "react";

function Assignment({user}){

  const [assignments, setAssgs] = useState([])
  console.log(assignments)

  useEffect( () => {
    console.log('inside')
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
   <div id="assg">
     <p>welcome to assg</p>
     <table className="styled-table">
       <thead>
         <tr>
           <th>id</th>
           <th>title</th>
           <th>grade</th>
         </tr>
       </thead>
       <tbody>
         {assignments.map( assObj => <tr key={assObj.id}>
          <td>{assObj.id}</td>
          <td><a href={assObj.url}>{assObj.title}</a></td>
          <td>{assObj.grade}</td>
         </tr>)}
       </tbody>
     </table>
   </div>
  )
}

export default Assignment