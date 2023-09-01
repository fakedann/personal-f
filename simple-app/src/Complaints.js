import React, { useEffect, useState } from "react";

function Complaints({user}){

  const [complaints, setComplaints] = useState([])

  useEffect( () => {
    console.log('inside')
    fetch(`http://127.0.0.1:5000/complaints/${user.email}/${user.Role_in_company}`, {
    }).then((r) => {
      if (r.ok) {
        r.json().then( (resp) => console.log(resp))
      } else{
        r.json().then( (err) => console.log(err))
      }
    })
  }, [])

  return (
    <div className="homePage">
      <p>compl!</p>
      {user.Role_in_company === "stu" ? <button className="botones">File complaint</button> : null}
    </div>
  )
}

export default Complaints