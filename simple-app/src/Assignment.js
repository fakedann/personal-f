import React, { useEffect } from "react";

function Assignment({user}){

  useEffect( () => {
    fetch(`http://127.0.0.1:5000/assignments/1`, {
    }).then((r) => {
      if (r.ok) {
        r.json().then( (resp) => console.log(resp))
      } else{
        r.json().then( (err) => console.log(err))
      }
    })
  }, [])

  return (
   <div>
     <p>welcome to assg</p>
   </div>
  )
}

export default Assignment