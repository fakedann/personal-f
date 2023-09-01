import React, { useState } from "react";
import Complaints from "./Complaints";


function ReviewComplaint({user}){

  const [view, setView] = useState('')

  if (view !== ''){
    return <Complaints user={user}/>
  }

  return (
    <div>
      <p>rewview!!!</p>
      <button id="cancelBtn" className="botones" onClick={ () => setView('e')}>Cancel</button>
    </div>
  )
}

export default ReviewComplaint